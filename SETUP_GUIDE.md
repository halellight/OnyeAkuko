# NewsHub AI News Agent - Setup Guide

## Overview
Complete AI-powered news aggregation system with twice-daily email digests featuring Nigerian news sources.

## Features
- ✅ News from Daily Trust, TechCabal, Punch, ThisDay, Sahara Reporters, Semafor
- ✅ Email subscriptions with time preferences (9 AM / 7 PM)
- ✅ Postmark email integration
- ✅ Automated cron job scheduling
- ✅ Category, region, and sentiment filtering

## Environment Variables

Add these to your Vercel project:

\`\`\`bash
POSTMARK_SERVER_TOKEN=your_postmark_token_here
CRON_SECRET=your_secure_random_string_here
\`\`\`

## Postmark Setup

1. Sign up at https://postmarkapp.com
2. Create a new server
3. Get your Server API Token
4. Add token to environment variables
5. Verify sender signature (news@yourdomain.com)

## Cron Job Setup

### Option 1: Vercel Cron (Recommended)

Add to `vercel.json`:

\`\`\`json
{
  "crons": [
    {
      "path": "/api/cron/send-digests",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/send-digests",
      "schedule": "0 19 * * *"
    }
  ]
}
\`\`\`

### Option 2: External Cron Service

Use services like:
- Cron-job.org
- EasyCron
- AWS EventBridge

Configure to call:
\`\`\`
GET https://your-domain.com/api/cron/send-digests
Authorization: Bearer YOUR_CRON_SECRET
\`\`\`

At: 09:00 UTC and 19:00 UTC daily

## Database Integration (Production)

Replace in-memory storage with Supabase or Neon:

\`\`\`sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  morning_digest BOOLEAN DEFAULT true,
  evening_digest BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## Testing

Test subscription:
\`\`\`bash
curl -X POST https://your-domain.com/api/notifications/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","digestTimes":{"morning":true,"evening":true}}'
\`\`\`

Test digest sending:
\`\`\`bash
curl https://your-domain.com/api/cron/send-digests \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
\`\`\`

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy
5. Configure cron jobs

Your AI News Agent is now live! 🚀
