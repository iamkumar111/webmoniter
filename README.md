# Website Uptime Monitoring System

A comprehensive monitoring system built with Next.js, MySQL, and Prisma.

## Features
- ✅ Website Uptime Monitoring (HTTP/HTTPS/Ping)
- ✅ SSL Certificate Expiration Tracking
- ✅ Response Time Measurement
- ✅ Email Alert System with Cooldowns
- ✅ Role-Based Access Control (4 roles)
- ✅ Real-time Dashboard & Historical Reports
- ✅ Background Monitoring Engine

## Tech Stack
- **Frontend:** Next.js 15+, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Next.js API Routes, NextAuth.js v5
- **Database:** MySQL, Prisma ORM
- **Engine:** Node-cron based background worker

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Copy `.env.example` to `.env` and fill in your database and SMTP details.
   ```bash
   cp .env.example .env
   ```

3. **Database Setup:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Run the Application:**
   Start the web server:
   ```bash
   npm run dev
   ```
   Start the monitoring engine in a separate process:
   ```bash
   npm run monitor
   ```

## Default Credentials
**Super Admin:**
- **Email:** iamkumar111@gmail.com
- **Password:** 123@HelloS

## System Requirements
- Node.js 20+
- MySQL 8.0+
