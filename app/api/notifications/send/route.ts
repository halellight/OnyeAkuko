import { type NextRequest, NextResponse } from "next/server"

async function sendEmailViaMailtrap(to: string, subject: string, htmlBody: string) {
  const MAILTRAP_API_KEY = process.env.MAILTRAP_API_KEY
  const MAILTRAP_ACCOUNT_ID = process.env.MAILTRAP_ACCOUNT_ID
  const MAILTRAP_INBOX_ID = process.env.MAILTRAP_INBOX_ID

  if (!MAILTRAP_API_KEY || !MAILTRAP_ACCOUNT_ID || !MAILTRAP_INBOX_ID) {
    console.error("[Mailtrap] Configuration not complete")
    return false
  }

  try {
    const response = await fetch(`https://send.api.mailtrap.io/api/send/${MAILTRAP_INBOX_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAILTRAP_API_KEY}`,
      },
      body: JSON.stringify({
        to: [{ email: to }],
        from: { email: "news@newshub.com", name: "NewsHub" },
        subject,
        html: htmlBody,
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
    <div style="margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 8px;">
      <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px;">${article.title}</h3>
      <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${article.description}</p>
      <div style="display: flex; gap: 12px; align-items: center; font-size: 12px; color: #9ca3af;">
        <span style="background: #e97b3c; color: white; padding: 2px 8px; border-radius: 4px;">${article.source}</span>
        <span>${article.category}</span>
        <span>Credibility: ${Math.round(article.credibility * 100)}%</span>
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
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; color: #1f2937; font-size: 28px;">📰 OnyeAkuko</h1>
      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">${digestTime} News Digest</p>
    </div>
    
    <div style="margin-bottom: 24px;">
      <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px;">Top Stories Today</h2>
      ${articlesHtml}
    </div>
    
    <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 8px;">
      <p style="margin: 0; color: #6b7280; font-size: 12px;">
        You're receiving this because you subscribed to NewsHub daily digests.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const { subscribers, articles, digestTime } = await request.json()

    if (!subscribers || !Array.isArray(subscribers) || subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers provided" }, { status: 400 })
    }

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json({ error: "No articles provided" }, { status: 400 })
    }

    const subject = `📰 Your ${digestTime} News Digest from NewsHub`
    const htmlBody = generateDigestEmail(articles, digestTime)

    const results = await Promise.allSettled(subscribers.map((email) => sendEmailViaMailtrap(email, subject, htmlBody)))

    const successful = results.filter((r) => r.status === "fulfilled" && r.value === true).length
    const failed = results.length - successful

    console.log(`[Digest Service] Sent ${successful} emails, ${failed} failed`)

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
