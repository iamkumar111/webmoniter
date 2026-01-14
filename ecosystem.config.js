module.exports = {
    apps: [
        {
            name: "uptime-robot-web",
            script: "npm",
            args: "start",
            env: {
                PORT: 8000,
                NODE_ENV: "production"
            }
        },
        {
            name: "uptime-robot-engine",
            script: "npx",
            args: "tsx src/monitoring-server.ts",
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};
