# Setting up Cron Jobs for OnyeAkuko

The project uses a Next.js API route as a cron trigger: `/api/cron/send-digests`.

## Option 1: Vercel Cron (Recommended)
If you are deploying on Vercel:
1. Create a `vercel.json` in your root directory:
```json
{
  "crons": [
    {
      "path": "/api/cron/send-digests",
      "schedule": "0 9,19 * * *"
    }
  ]
}
```
2. Add `CRON_SECRET` to your Vercel environment variables.
3. The code checks for `Authorization: Bearer [CRON_SECRET]`.

**Using PowerShell (Manual Trigger):**
```powershell
# Send Morning Digest
Invoke-RestMethod -Uri "http://localhost:3000/api/cron/send-digests?force=Morning" -Headers @{"Authorization"="Bearer your_cron_secret"} -Method Get

# Send Evening Digest
Invoke-RestMethod -Uri "http://localhost:3000/api/cron/send-digests?force=Evening" -Headers @{"Authorization"="Bearer your_cron_secret"} -Method Get
```

### Required `.env.local`
```bash
CRON_SECRET=a_random_secure_string
```
