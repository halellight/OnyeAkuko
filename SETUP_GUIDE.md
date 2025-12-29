# OnyeAkuko AI News Agent - Setup Guide

## Overview
Intelligence digest platform for the modern Nigerian observer, featuring automated news curation and delivery.

## Features
- ✅ News from Daily Trust, TechCabal, Punch, ThisDay, Sahara Reporters, Semafor
- ✅ Email subscriptions with time preferences (9 AM / 7 PM)
- ✅ Mailtrap Sending API integration (Domain: `onyeakuko.online`)
- ✅ Automated cron job scheduling via Vercel
- ✅ Supabase persistence for subscribers
- ✅ Category, region, and sentiment filtering

## Environment Variables

Add these to your `.env.local` and your Vercel project:

```bash
# Mailtrap
MAILTRAP_API_KEY="your_api_key"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_key"

# Security
CRON_SECRET="your_secure_random_string_here"
```

## Mailtrap Setup

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Add and verify your domain: `onyeakuko.online`
3. Add the DNS records provided by Mailtrap to your registrar.
4. Get your API Token from **Settings > API Tokens**.

## Cron Job Setup

The project uses `vercel.json` for scheduling. When you deploy to Vercel, it will automatically register:
- **Daily Digest**: 09:00 UTC (Limit: 1/day on Hobby Tier)

### Manual Testing (Local)
Ensure your local server is running (`npm run dev`), then use PowerShell:

```powershell
# Morning
Invoke-RestMethod -Uri "http://localhost:3000/api/cron/send-digests?force=Morning" -Headers @{"Authorization"="Bearer your_cron_secret"} -Method Get

# Evening
Invoke-RestMethod -Uri "http://localhost:3000/api/cron/send-digests?force=Evening" -Headers @{"Authorization"="Bearer your_cron_secret"} -Method Get
```

## Database Integration
The system uses Supabase. Ensure your `subscriptions` table is set up:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  morning_digest BOOLEAN DEFAULT true,
  evening_digest BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add all environment variables listed above
4. Deploy
5. Verify domain on Mailtrap

Your OnyeAkuko News Agent is now live! 🚀
