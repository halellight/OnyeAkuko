import { supabaseAdmin } from "./supabase"

export async function sendEmailViaMailtrap(to: string, subject: string, htmlBody: string) {
  const MAILTRAP_API_KEY = process.env.MAILTRAP_API_KEY

  if (!MAILTRAP_API_KEY) {
    console.error("[Mailtrap] Configuration not complete: MAILTRAP_API_KEY missing")
    return false
  }

  try {
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

export function generateDigestEmail(articles: any[], digestTime: string, editorialNote?: string) {
  const articlesHtml = articles
    .slice(0, 5)
    .map(
      (article) => `
    <div style="margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #d1d1d1;">
      <h3 style="margin: 0 0 12px 0; color: #111111; font-size: 26px; line-height: 1.1; font-weight: 900; letter-spacing: -0.02em; font-family: 'Satoshi', sans-serif;">${article.title}</h3>
      
      <div style="margin-bottom: 16px;">
        <span style="color: #e59c6a; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-family: 'Satoshi', sans-serif;">${article.source}</span>
        <span style="color: #999999; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-left: 8px; font-family: 'Satoshi', sans-serif;">• ${article.category}</span>
      </div>

      <div style="margin-bottom: 20px; overflow: hidden; background: #f5f5f5; border: 1px solid #e0e0e0;">
        <img src="${(article.imageUrl && article.imageUrl !== 'N/A' && article.imageUrl.startsWith('http') && !article.imageUrl.includes('default.jpg')) ? article.imageUrl : 'https://onyeakuko.online/Group728.png'}" alt="${article.title}" style="width: 100%; height: auto; display: block; max-height: 280px; object-fit: cover; filter: grayscale(20%);">
      </div>
      
      <div style="margin: 0 0 24px 0;">
        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.7; font-family: 'Georgia', serif;">${article.description}</p>
      </div>

      <!-- Action Row -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="left" valign="middle">
            <a href="${article.link}" style="display: inline-block; padding: 14px 28px; background: #e59c6a; color: #000000; text-decoration: none; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Satoshi', sans-serif; border: 1px solid #c78356;">READ FULL ARTICLE</a>
          </td>
        </tr>
      </table>
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
  <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
  <style>
    @import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
    body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  </style>
</head>
<body style="margin: 0; padding: 0; background: #f4f4f4; color: #111111;">
  <div style="max-width: 640px; margin: 0 auto; background: #ffffff;">
    
    


    <!-- Header -->
    <div style="padding: 48px 32px 32px 32px; text-align: center; background: #ffffff;">
      <!-- Logo Circle -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            <div style="width: 72px; height: 72px; background-color: #0d0d0d; border-radius: 50%; padding: 0; margin: 0 auto 24px auto;">
              <img src="https://onyeakuko.online/Group728.png" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;" />
            </div>
          </td>
        </tr>
      </table>
      
      <!-- App Name in Anton -->
      <h1 style="margin: 0 0 16px 0; color: #000000; font-size: 46px; text-transform: uppercase; letter-spacing: 0.02em; font-family: 'Anton', Impact, 'Arial Black', Arial, sans-serif; font-weight: 900; line-height: 1;">ONYEAKỤKỌ</h1>
      
      <!-- Digest Subtitle -->
      <p style="margin: 0; color: #666666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; font-family: 'Satoshi', sans-serif;">INTELLIGENCE DIGEST • ${digestTime.toUpperCase()}</p>
    </div>

    <!-- Today's Focus Block -->
    <div style="background: #000000; padding: 48px 32px; text-align: center;">
      <p style="margin: 0 0 16px 0; color: #a3a3a3; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.25em; font-family: 'Satoshi', sans-serif;">TODAY'S FOCUS</p>
      <h2 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; font-family: 'Satoshi', sans-serif; line-height: 1.35; letter-spacing: -0.01em;">Curated Intelligence for the Modern<br>Nigerian Observer</h2>
    </div>
    
    <!-- Hero Article/Notice -->
    ${editorialNote ? `
    <div style="padding: 32px; background: #111111; color: #ffffff; border-top: 1px solid #333333;">
      <p style="margin: 0 0 16px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; font-family: 'Satoshi', sans-serif; color: #e59c6a;">Editorial Address</p>
      <div style="font-size: 16px; font-weight: 400; line-height: 1.7; color: #f5f5f5; font-family: 'Georgia', serif;">
        <p style="margin: 0;">${editorialNote.replace(/\n\n/g, '</p><p style="margin: 16px 0 0 0;">').replace(/\n/g, '<br>')}</p>
      </div>
    </div>
    ` : ''}

    <!-- Articles List -->
    <div style="padding: 32px;">
      ${articlesHtml}
    </div>
    
    <!-- Footer -->
    <div style="padding: 48px 32px; background: #f5f5f5; border-top: 1px solid #d1d1d1; text-align: left;">
      <div style="display: flex; align-items: flex-start; justify-content: flex-start;">
        <img src="https://onyeakuko.online/Group728.png" alt="OnyeAkụkọ Logo" style="width: 48px; height: 48px; border: 1px solid #cccccc; background: #ffffff;">
        <div style="margin-left: 16px;">
          <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 900; font-family: 'Satoshi', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; color: #000000;">ONYEAKỤKỌ</h3>
          <p style="margin: 0; font-size: 12px; font-family: 'Georgia', serif; font-style: italic; color: #666666;">Intelligence Unfiltered. Daily.</p>
        </div>
      </div>
      
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e0e0e0; font-family: 'Satoshi', sans-serif;">
        <a href="https://onyeakuko.online" style="color: #000000; text-decoration: underline; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 16px;">Visit Our Website</a>
        <a href="#" style="color: #666666; text-decoration: underline; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Unsubscribe</a>
        <p style="margin: 16px 0 0 0; font-size: 10px; color: #999999; font-weight: 500;">&copy; ${new Date().getFullYear()} OnyeAkụkọ All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `
}

export async function processDigestSending(options: { subscribers?: string[], articles: any[], digestTime: string, editorialNote?: string }) {
  let { subscribers, articles, digestTime, editorialNote } = options

  if (!subscribers || subscribers.length === 0) {
    const column = digestTime?.toLowerCase().includes("morning") ? "morning_digest" : "evening_digest"
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('email')
      .eq(column, true)

    if (error) {
      console.error("[Supabase] Failed to fetch subscribers:", error)
      throw new Error("Failed to fetch subscribers")
    }
    subscribers = data.map(s => s.email)
  }

  if (!subscribers || subscribers.length === 0) {
    return { successful: 0, failed: 0, total: 0, message: "No subscribers found" }
  }

  const subject = `📰 Your ${digestTime} Digest | OnyeAkuko`
  const htmlBody = generateDigestEmail(articles, digestTime, editorialNote)

  const results = await Promise.allSettled(subscribers.map((email: string) => sendEmailViaMailtrap(email, subject, htmlBody)))

  const successful = results.filter((r) => r.status === "fulfilled" && r.value === true).length
  const failed = results.length - successful

  return { successful, failed, total: results.length }
}
