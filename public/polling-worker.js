// Web Worker for reliable background polling
// This runs in a separate thread and is less likely to be throttled when the tab is in the background

self.onmessage = function (e) {
    if (e.data.type === 'START') {
        // Start polling
        checkIncidents(); // Initial check

        // Poll every 10 seconds (more frequent to ensure at least some checks get through if throttled)
        setInterval(checkIncidents, 10000);
    }
};

let lastServerTime = Date.now();

async function checkIncidents() {
    try {
        // Fetch only incidents since the last check
        const response = await fetch(`/api/notifications/check?since=${lastServerTime}`);
        const data = await response.json();

        // Update time if provided
        if (data.serverTime) {
            lastServerTime = data.serverTime;
        }

        // Check for new single incident
        if (data.newIncident) {
            self.postMessage({ type: 'INCIDENT', incident: data.newIncident });
        }

        // Check for accumulated incidents (from catch-up)
        if (data.incidents && Array.isArray(data.incidents) && data.incidents.length > 0) {
            data.incidents.forEach(incident => {
                self.postMessage({ type: 'INCIDENT', incident: incident });
            });
        }
    } catch (error) {
        // Silent fail on network errors (will retry next interval)
    }
}
