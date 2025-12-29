import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

async function sendEmailViaMailtrap(to: string, subject: string, htmlBody: string) {
  const MAILTRAP_API_KEY = process.env.MAILTRAP_API_KEY

  if (!MAILTRAP_API_KEY) {
    console.error("[Mailtrap] Configuration not complete: MAILTRAP_API_KEY missing")
    return false
  }

  try {
    // Mailtrap Sending API Endpoint
    // Note: If you want to use the Inbox API, you'd use a different URL: https://sandbox.api.mailtrap.io/api/send/{id}
    const response = await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAILTRAP_API_KEY}`,
      },
      body: JSON.stringify({
        to: [{ email: to }],
        from: { email: "news@onyeakuko.online", name: "OnyeAkuko" },
        subject,
        html: htmlBody,
        category: "News Digest"
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[Mailtrap] Send failed:", error)
      return false
    }

    console.log(`[Mailtrap] Email sent successfully to ${to}`)
    return true
  } catch (error) {
    console.error("[Mailtrap] Error:", error)
    return false
  }
}

function generateDigestEmail(articles: any[], digestTime: string) {
  const articlesHtml = articles
    .slice(0, 5)
    .map(
      (article) => `
    <div style="margin-bottom: 24px; padding: 20px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="display: flex; gap: 12px; margin-bottom: 12px;">
        <span style="background: #e97b3c; color: white; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: bold; text-transform: uppercase;">${article.source}</span>
        <span style="color: #6b7280; font-size: 12px;">${article.category}</span>
      </div>
      <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 18px; line-height: 1.4; font-weight: 700;">${article.title}</h3>
      <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px; line-height: 1.6;">${article.description}</p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
         <a href="${article.link}" style="display: inline-block; padding: 8px 16px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 12px; font-weight: 600;">Read More →</a>
         <span style="color: #9ca3af; font-size: 12px;">Credibility: ${Math.round(article.credibility * 100)}%</span>
      </div>
    </div>
  `,
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
    body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; background: #fafafa; color: #1a1a1a;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
    <!-- Header -->
    <div style="padding: 40px 20px; text-align: center; border-bottom: 1px solid #f0f0f0;">
      <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: 800; letter-spacing: -0.05em; text-transform: uppercase;">OnyeAkuko</h1>
      <p style="margin: 8px 0 0 0; color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Intelligence Digest • ${digestTime}</p>
    </div>
    
    <!-- Hero Article/Notice -->
    <div style="padding: 30px 20px; background: #000000; color: #ffffff; text-align: center;">
      <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.8;">Today's Focus</p>
      <h2 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700; line-height: 1.3;">Curated Intelligence for the Modern Nigerian Observer</h2>
    </div>

    <!-- Articles List -->
    <div style="padding: 40px 20px;">
      <h2 style="margin: 0 0 24px 0; font-size: 16px; font-weight: 800; color: #000000; text-transform: uppercase; letter-spacing: 0.05em; border-left: 4px solid #000000; padding-left: 12px;">The Briefing</h2>
      ${articlesHtml}
    </div>
    
    <!-- Footer -->
    <div style="padding: 40px 20px; background: #000000; color: #ffffff; text-align: center;">
      <h3 style="margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em;">OnyeAkuko</h3>
      <p style="margin: 12px 0; color: #999999; font-size: 12px; line-height: 1.6;">
        Unfiltered. Intelligent. Essential.<br>
        Focused on Nigerian and Global News Intelligence.
      </p>
      <div style="margin: 20px 0;">
        <a href="#" style="color: #ffffff; text-decoration: underline; font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.1em;">Unsubscribe</a>
      </div>
      <p style="margin: 0; font-size: 10px; color: #666666;">&copy; ${new Date().getFullYear()} OnyeAkuko Media Intelligence</p>
    </div>
  </div>
</body>
</html>
  `
}

export async function POST(request: NextRequest) {
  try {
    let { subscribers, articles, digestTime } = await request.json()

    // 🤖 If no subscribers provided, fetch from Supabase based on digestTime
    if (!subscribers || !Array.isArray(subscribers) || subscribers.length === 0) {
      console.log(`[OnyeAkuko] No subscribers provided, fetching from Supabase for ${digestTime}...`)

      const column = digestTime?.toLowerCase().includes("morning") ? "morning_digest" : "evening_digest"

      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('email')
        .eq(column, true)

      if (error) {
        console.error("[Supabase] Failed to fetch subscribers:", error)
        return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
      }

      subscribers = data.map(s => s.email)
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("[OnyeAkuko] No subscribers found for this time slot.")
      return NextResponse.json({ message: "No subscribers found for this digest time" }, { status: 200 })
    }

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json({ error: "No articles provided" }, { status: 400 })
    }

    const subject = `📰 Your ${digestTime} Digest | OnyeAkuko`
    const htmlBody = generateDigestEmail(articles, digestTime)

    const results = await Promise.allSettled(subscribers.map((email: string) => sendEmailViaMailtrap(email, subject, htmlBody)))

    const successful = results.filter((r) => r.status === "fulfilled" && r.value === true).length
    const failed = results.length - successful

    console.log(`[OnyeAkuko Digest] Sent ${successful} emails, ${failed} failed`)

    return NextResponse.json({
      message: "Digest sending completed",
      successful,
      failed,
      total: results.length,
    })
  } catch (error) {
    console.error("Digest send error:", error)
    return NextResponse.json({ error: "Failed to send digest" }, { status: 500 })
  }
}
