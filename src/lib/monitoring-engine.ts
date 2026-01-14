import axios from 'axios';
import { prisma } from './prisma';
import { Monitor, MonitorStatus, MonitorType, IncidentStatus } from '@prisma/client';
import { sendDownAlert, sendRecoveryAlert, sendSlowResponseAlert, sendSSLAlert } from './email';
import { queueEmailNotification } from './notification-queue';
import https from 'https';
import http from 'http';

// Connection pooling for high performance
const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 500,
  timeout: 10000,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 500,
  timeout: 10000,
  rejectUnauthorized: true,
});

export async function runMonitorCheck(monitorId: string) {
  const monitor = await prisma.monitor.findUnique({
    where: { id: monitorId },
    include: { user: true }
  });

  if (!monitor || monitor.status === MonitorStatus.PAUSED) return;

  const startTime = Date.now();
  let status: MonitorStatus = MonitorStatus.UP;
  let responseTime = 0;
  let statusCode: number | null = null;
  let errorMessage: string | null = null;
  let responseHeaders: any = null;
  let responseBody: string | null = null;

  try {
    if (monitor.type === MonitorType.HTTP || monitor.type === MonitorType.HTTPS) {
      const response = await axios({
        method: monitor.method,
        url: monitor.url,
        headers: (monitor.headers as any) || {},
        data: monitor.body,
        timeout: monitor.timeout * 1000,
        validateStatus: () => true, // Don't throw for error status codes
        httpsAgent: new https.Agent({
          rejectUnauthorized: monitor.verifySSL,
        }),
      });

      responseTime = Date.now() - startTime;
      statusCode = response.status;
      responseHeaders = response.headers;
      responseBody = typeof response.data === 'string'
        ? response.data.substring(0, 1000)
        : JSON.stringify(response.data).substring(0, 1000);

      // Validate status code
      if (statusCode !== monitor.expectedStatusCode) {
        status = MonitorStatus.DOWN;
        errorMessage = `Expected status code ${monitor.expectedStatusCode}, but got ${statusCode}`;
      }

      // Validate expected content
      if (status === MonitorStatus.UP && monitor.expectedContent) {
        if (!responseBody.includes(monitor.expectedContent)) {
          status = MonitorStatus.DOWN;
          errorMessage = `Expected content "${monitor.expectedContent}" not found in response`;
        }
      }

      // Check for degraded status
      if (status === MonitorStatus.UP && responseTime > monitor.responseThreshold) {
        status = MonitorStatus.DEGRADED;
      }
    } else if (monitor.type === MonitorType.PING) {
      // For ping we just check TCP connection
      const url = new URL(monitor.url);
      const port = url.port || (url.protocol === 'https:' ? '443' : '80');

      const pingStartTime = Date.now();
      await new Promise((resolve, reject) => {
        const socket = https.request({
          hostname: url.hostname,
          port: parseInt(port),
          method: 'HEAD',
          timeout: monitor.timeout * 1000,
        }, (res) => {
          resolve(res);
        });
        socket.on('error', reject);
        socket.on('timeout', () => {
          socket.destroy();
          reject(new Error('Timeout'));
        });
        socket.end();
      });
      responseTime = Date.now() - pingStartTime;
      status = MonitorStatus.UP;
    }
  } catch (error: any) {
    responseTime = Date.now() - startTime;
    status = MonitorStatus.DOWN;
    errorMessage = error.message;
  }

  // Handle Thresholds and State Changes
  await handleMonitorStateChange(monitor, status, responseTime, statusCode, errorMessage, responseHeaders, responseBody);
}

async function handleMonitorStateChange(
  monitor: any,
  currentStatus: MonitorStatus,
  responseTime: number,
  statusCode: number | null,
  errorMessage: string | null,
  responseHeaders: any,
  responseBody: string | null
) {
  const isCurrentlyDown = monitor.status === MonitorStatus.DOWN;
  let newStatus = monitor.status;
  let consecutiveFailures = monitor.consecutiveFailures;
  let consecutiveSuccesses = monitor.consecutiveSuccesses;

  if (currentStatus === MonitorStatus.DOWN) {
    consecutiveFailures++;
    consecutiveSuccesses = 0;
    if (consecutiveFailures >= monitor.failureThreshold) {
      newStatus = MonitorStatus.DOWN;
    }
  } else {
    consecutiveSuccesses++;
    consecutiveFailures = 0;
    if (isCurrentlyDown) {
      if (consecutiveSuccesses >= monitor.recoveryThreshold) {
        newStatus = MonitorStatus.UP;
      }
    } else {
      newStatus = currentStatus; // Could be DEGRADED or UP
    }
  }

  // Record Check
  await prisma.check.create({
    data: {
      monitorId: monitor.id,
      status: currentStatus,
      responseTime,
      statusCode,
      errorMessage,
      headers: responseHeaders,
      body: responseBody,
    }
  });

  // Update Monitor
  await prisma.monitor.update({
    where: { id: monitor.id },
    data: {
      status: newStatus,
      lastCheck: new Date(),
      nextCheck: new Date(Date.now() + monitor.interval * 60 * 1000),
      consecutiveFailures,
      consecutiveSuccesses,
    }
  });

  // Handle Incidents and Alerts
  if (newStatus === MonitorStatus.DOWN && !isCurrentlyDown) {
    // New Incident
    const incident = await prisma.incident.create({
      data: {
        monitorId: monitor.id,
        type: MonitorStatus.DOWN,
        errorDetails: errorMessage,
        status: IncidentStatus.OPEN,
      }
    });

    if (monitor.alertOnDown) {
      // Fire-and-forget: queue notification without blocking
      queueEmailNotification(() => sendDownAlert(monitor, errorMessage, responseTime));
    }
  } else if (newStatus === MonitorStatus.UP && isCurrentlyDown) {
    // Resolve Incident
    const openIncident = await prisma.incident.findFirst({
      where: { monitorId: monitor.id, status: IncidentStatus.OPEN, type: MonitorStatus.DOWN },
      orderBy: { startTime: 'desc' }
    });

    if (openIncident) {
      const duration = Math.floor((Date.now() - openIncident.startTime.getTime()) / 1000);
      await prisma.incident.update({
        where: { id: openIncident.id },
        data: {
          endTime: new Date(),
          duration,
          status: IncidentStatus.RESOLVED,
        }
      });

      if (monitor.alertOnRecovery) {
        queueEmailNotification(() => sendRecoveryAlert(monitor, duration, responseTime));
      }
    }
  } else if (currentStatus === MonitorStatus.DEGRADED && monitor.alertOnSlow) {
    // Fire-and-forget slow response alert
    queueEmailNotification(() => sendSlowResponseAlert(monitor, responseTime));
  }

  // SSL Check if HTTPS
  if (monitor.type === MonitorType.HTTPS && monitor.verifySSL) {
    await checkSSL(monitor);
  }
}

async function checkSSL(monitor: any) {
  try {
    const url = new URL(monitor.url);

    await new Promise<void>((resolve, reject) => {
      const options = {
        hostname: url.hostname,
        port: 443,
        method: 'GET',
        agent: new https.Agent({ rejectUnauthorized: false }),
        timeout: 10000
      };

      const req = https.request(options, async (res) => {
        try {
          const cert = (res.socket as any).getPeerCertificate();
          if (cert && cert.valid_to) {
            const validUntil = new Date(cert.valid_to);
            const daysRemaining = Math.ceil((validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            await prisma.sslCertificate.upsert({
              where: { monitorId: monitor.id },
              update: {
                validFrom: new Date(cert.valid_from),
                validUntil,
                daysRemaining,
                issuer: cert.issuer?.O || 'Unknown',
                subject: cert.subject?.CN || url.hostname,
                serialNumber: cert.serialNumber,
              },
              create: {
                monitorId: monitor.id,
                validFrom: new Date(cert.valid_from),
                validUntil,
                daysRemaining,
                issuer: cert.issuer?.O || 'Unknown',
                subject: cert.subject?.CN || url.hostname,
                serialNumber: cert.serialNumber,
              }
            });

            // Check against fixed thresholds [30, 15, 10, 5, 4, 3, 2, 1, 0]
            const thresholds = [30, 15, 10, 5, 4, 3, 2, 1, 0];

            if (monitor.alertOnSSL && thresholds.includes(daysRemaining)) {
              const currentCert = await prisma.sslCertificate.findUnique({
                where: { monitorId: monitor.id }
              });

              const lastAlert = currentCert?.lastAlertDate;
              const shouldAlert = !lastAlert ||
                lastAlert.toDateString() !== new Date().toDateString();

              if (shouldAlert) {
                await sendSSLAlert(monitor, daysRemaining, validUntil);

                await prisma.sslCertificate.update({
                  where: { monitorId: monitor.id },
                  data: { lastAlertDate: new Date() }
                });
              }
            }
          }
          resolve();
        } catch (innerError) {
          reject(innerError);
        }
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('SSL check timeout'));
      });
      req.end();
    });
  } catch (error) {
    console.error(`SSL check failed for ${monitor.url}:`, error);
  }
}
