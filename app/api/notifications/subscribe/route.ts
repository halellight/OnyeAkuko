import { type NextRequest, NextResponse } from "next/server"

interface Subscription {
  email: string
  digestTimes: {
    morning: boolean
    evening: boolean
  }
  categories?: string[]
  subscribedAt: string
}

// In-memory storage for demo purposes
// In production, use a database like Supabase or Neon
const subscriptions = new Map<string, Subscription>()

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

    // Check if already subscribed
    if (subscriptions.has(email.toLowerCase())) {
      // Update existing subscription
      const existing = subscriptions.get(email.toLowerCase())!
      existing.digestTimes = digestTimes
      subscriptions.set(email.toLowerCase(), existing)
      return NextResponse.json({ message: "Subscription updated" }, { status: 200 })
    }

    // Add subscription
    subscriptions.set(email.toLowerCase(), {
      email: email.toLowerCase(),
      digestTimes,
      subscribedAt: new Date().toISOString(),
    })

    console.log(`[Email Service] New subscription: ${email}`, digestTimes)

    return NextResponse.json({ message: "Successfully subscribed", email }, { status: 201 })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

export async function GET() {
  // For debugging only - returns all subscriptions
  return NextResponse.json({
    totalSubscriptions: subscriptions.size,
    subscriptions: Array.from(subscriptions.values()),
  })
}

export { subscriptions }
