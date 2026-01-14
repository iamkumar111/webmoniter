import nodemailer from 'nodemailer';
import { prisma } from './prisma';
import { AlertStatus } from '@prisma/client';

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:8000';

export function createTransporter(config: { host: string; port: number; user: string; pass: string }) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

async function getTransporter() {
  const config = await prisma.smtpConfig.findUnique({
    where: { id: 'default' }
  });

  if (!config) {
    console.error('SMTP configuration not found. Emails will not be sent.');
    return null;
  }

  return createTransporter(config);
}

export async function sendTestEmail(config: any, to: string) {
  const transporter = createTransporter(config);
  const subject = "UptimeRobot SMTP Test";
  const text = `This is a test email from your UptimeRobot monitoring system. Your SMTP settings are correctly configured! Target: ${to}`;
  const html = `
    <h1>SMTP Test Successful</h1>
    <p>${text}</p>
    <p>Sent at: ${new Date().toISOString()}</p>
  `;

  try {
    await transporter.sendMail({
      from: {
        name: config?.fromName || "WebMoniter",
        address: config?.fromEmail || ""
      },
      replyTo: config?.fromEmail || "",
      to,
      subject,
      text,
      html,
    });
    return { success: true };
  } catch (error: any) {
    console.error("SMTP Test failed:", error);
    return { success: false, error: error.message };
  }
}

export async function sendMail({ to, subject, html, text }: { to: string, subject: string, html: string, text: string }) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const config = await prisma.smtpConfig.findUnique({ where: { id: 'default' } });

  try {
    await transporter.sendMail({
      from: {
        name: config?.fromName || "WebMoniter",
        address: config?.fromEmail || ""
      },
      replyTo: config?.fromEmail || "",
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return false;
  }
}

async function sendEmail(monitor: any, type: string, subject: string, html: string, text: string) {
  const recipients = monitor.recipients ? monitor.recipients.split(',').map((r: string) => r.trim()) : [monitor.user.email];

  for (const recipient of recipients) {
    // Check alert cooldown (BUG-012)
    const cooldownMs = (monitor.alertCooldown || 5) * 60 * 1000;
    const lastAlert = await prisma.alertLog.findFirst({
      where: {
        monitorId: monitor.id,
        type,
        recipient,
        createdAt: { gte: new Date(Date.now() - cooldownMs) }
      }
    });

    if (lastAlert) continue;

    const success = await sendMail({ to: recipient, subject, html, text });

    await prisma.alertLog.create({
      data: {
        monitorId: monitor.id,
        type,
        recipient,
        status: success ? AlertStatus.SENT : AlertStatus.FAILED,
        error: success ? undefined : "Failed to send email",
      }
    });
  }
}

export async function sendDownAlert(monitor: any, error: string | null, responseTime: number) {
  const subject = `🔴 Monitor Down: ${monitor.name}`;
  const html = `
    <h1>Monitor Down</h1>
    <p><strong>Monitor:</strong> ${monitor.name} (${monitor.url})</p>
    <p><strong>Status:</strong> DOWN</p>
    <p><strong>Error:</strong> ${error || 'Unknown error'}</p>
    <p><strong>Response Time:</strong> ${responseTime}ms</p>
    <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    <a href="${baseUrl}/monitors/${monitor.id}">View Monitor Details</a>
  `;
  const text = `Monitor Down: ${monitor.name} (${monitor.url}) is DOWN. Error: ${error || 'Unknown error'}. Response Time: ${responseTime}ms.`;

  await sendEmail(monitor, 'DOWN', subject, html, text);
}

export async function sendRecoveryAlert(monitor: any, duration: number, responseTime: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const durationText = `${minutes}m ${seconds}s`;

  const subject = `🟢 Monitor Recovered: ${monitor.name}`;
  const html = `
    <h1>Monitor Recovered</h1>
    <p><strong>Monitor:</strong> ${monitor.name} (${monitor.url})</p>
    <p><strong>Status:</strong> UP</p>
    <p><strong>Total Downtime:</strong> ${durationText}</p>
    <p><strong>Response Time:</strong> ${responseTime}ms</p>
    <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    <a href="${baseUrl}/dashboard">View Dashboard</a>
  `;
  const text = `Monitor Recovered: ${monitor.name} (${monitor.url}) is back UP. Total Downtime: ${durationText}. Response Time: ${responseTime}ms.`;

  await sendEmail(monitor, 'RECOVERY', subject, html, text);
}

export async function sendSlowResponseAlert(monitor: any, responseTime: number) {
  const subject = `🟡 Slow Response: ${monitor.name}`;
  const html = `
    <h1>Slow Response Detected</h1>
    <p><strong>Monitor:</strong> ${monitor.name} (${monitor.url})</p>
    <p><strong>Current Response Time:</strong> ${responseTime}ms</p>
    <p><strong>Threshold:</strong> ${monitor.responseThreshold}ms</p>
    <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    <a href="${baseUrl}/monitors/${monitor.id}">View Performance Data</a>
  `;
  const text = `Slow Response: ${monitor.name} (${monitor.url}) is responding in ${responseTime}ms, exceeding threshold of ${monitor.responseThreshold}ms.`;

  await sendEmail(monitor, 'SLOW_RESPONSE', subject, html, text);
}

export async function sendSSLAlert(monitor: any, daysRemaining: number, expirationDate: Date) {
  const subject = `🔒 SSL Certificate Expiring Soon: ${monitor.name}`;
  const html = `
    <h1>SSL Certificate Warning</h1>
    <p><strong>Monitor:</strong> ${monitor.name} (${monitor.url})</p>
    <p><strong>Days Remaining:</strong> ${daysRemaining}</p>
    <p><strong>Expiration Date:</strong> ${expirationDate.toDateString()}</p>
    <a href="${baseUrl}/monitors/${monitor.id}">View Certificate Details</a>
  `;
  const text = `SSL Certificate for ${monitor.name} (${monitor.url}) expires in ${daysRemaining} days on ${expirationDate.toDateString()}.`;

  await sendEmail(monitor, 'SSL_EXPIRING', subject, html, text);
}
