Production Deployment Guide (PM2)

This guide explains how to deploy the UptimeRobot application to production using PM2.

 1. Prerequisites
- Node.js 18+ installed
- PM2 installed globally: npm install -g pm2
- MySQL database accessible

 2. Environment Setup
Configure your .env file:
- DATABASE_URL: Your production database URL
- NEXTAUTH_SECRET: A secure random string
- NEXTAUTH_URL: Your production domain
- SMTP_*: Your email server configuration

 3. Deployment Steps
bash
 1. Install dependencies
npm install

 2. Sync database schema
npx prisma generate
npx prisma db push

 3. Build the application
npm run build

 4. Start everything with PM2
pm2 start ecosystem.config.js


 4. Useful PM2 Commands
- pm2 status: View running processes
- pm2 logs: View logs
- pm2 restart all: Restart all processes
- pm2 save: Save process list for system reboots

 5. Automated Deployment (GitHub Actions)
The repository is configured with GitHub Actions for automated deployment.
Ensure the following secrets are added to your GitHub Repository (Settings > Secrets and variables > Actions):
- SSH_HOST: Your server IP
- SSH_USER: Your server username
- SSH_KEY: Your private SSH key
- APP_DIR: Full path to your app directory

Deployment triggers automatically on every push to the `master` branch.
