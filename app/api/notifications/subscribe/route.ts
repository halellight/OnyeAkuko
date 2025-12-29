import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

async function sendWelcomeEmail(to: string) {
  const MAILTRAP_API_KEY = process.env.MAILTRAP_API_KEY

  if (!MAILTRAP_API_KEY) {
    console.warn("[Mailtrap] Skipping welcome email: MAILTRAP_API_KEY missing")
    return
  }

  const htmlBody = `
    <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 12px;">
      <h1 style="color: #000; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.05em; margin-bottom: 24px;">Welcome to OnyeAkuko</h1>
      <p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Thank you for joining our intelligence community. You've been successfully subscribed to the OnyeAkuko news digests.
      </p>
      <p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
        Our mission is to provide you with the most curated, intelligent, and essential news briefing for the modern Nigerian observer. You'll receive your selected digests directly in your inbox.
      </p>
      <div style="background: #fafafa; padding: 24px; border-radius: 8px; border: 1px solid #f0f0f0; margin-bottom: 32px;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 12px 0;">What to expect</h2>
        <ul style="margin: 0; padding: 0; list-style: none; color: #222; font-size: 14px;">
          <li style="margin-bottom: 8px;">• Curated Nigerian & Global News Intelligence</li>
          <li style="margin-bottom: 8px;">• Sentiment Analysis & Credibility Ratings</li>
          <li>• Twice Daily Briefings (9 AM / 7 PM UTC)</li>
        </ul>
      </div>
      <p style="color: #888; font-size: 12px; font-style: italic;">
        Stay informed. Stay ahead.
      </p>
    </div>
  `

  try {
    await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAILTRAP_API_KEY}`,
      },
      body: JSON.stringify({
        to: [{ email: to }],
        from: { email: "news@onyeakuko.online", name: "OnyeAkuko" },
        subject: "Welcome to OnyeAkuko | Intelligence Activated",
        html: htmlBody,
        category: "Welcome"
      }),
    })
    console.log(`[Mailtrap] Welcome email sent to ${to}`)
  } catch (error) {
    console.error("[Mailtrap] Failed to send welcome email:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, digestTimes } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (!digestTimes || (!digestTimes.morning && !digestTimes.evening)) {
      return NextResponse.json({ error: "Please select at least one digest time" }, { status: 400 })
    }

    const emailKey = email.toLowerCase()

    // Upsert subscription into Supabase
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        email: emailKey,
        morning_digest: !!digestTimes.morning,
        evening_digest: !!digestTimes.evening,
        subscribed_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })

    if (error) {
      console.error("[Supabase] Subscription error:", error)
      return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
    }

    // 📧 Send Welcome Email (Non-blocking)
    sendWelcomeEmail(emailKey).catch(err => console.error("Welcome email background error:", err))

    console.log(`[OnyeAkuko] New/Updated subscription: ${emailKey}`, digestTimes)

    return NextResponse.json({ message: "Successfully subscribed", email: emailKey }, { status: 201 })
  } catch (error) {
    console.error("Subscription route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, count, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact' })

    if (error) {
      console.error("[Supabase] Fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
    }

    return NextResponse.json({
      totalSubscriptions: count || 0,
      subscriptions: data,
    })
  } catch (error) {
    console.error("Subscription GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
