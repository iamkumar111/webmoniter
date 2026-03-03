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

# 📄 Open Source License

## MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
