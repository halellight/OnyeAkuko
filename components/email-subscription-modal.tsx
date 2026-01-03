"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EmailSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EmailSubscriptionModal({ isOpen, onClose }: EmailSubscriptionModalProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")
  const [morningDigest, setMorningDigest] = useState(true)
  const [eveningDigest, setEveningDigest] = useState(true)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!morningDigest && !eveningDigest) {
      setError("Please select at least one digest time")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          digestTimes: {
            morning: morningDigest,
            evening: eveningDigest,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to subscribe")
      }

      setSubscribed(true)
      setEmail("")
      setTimeout(() => {
        setSubscribed(false)
        onClose()
      }, 2000)
    } catch (err) {
      setError("Failed to subscribe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Subscribe to Updates</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <span className="text-muted-foreground text-lg">✕</span>
          </button>
        </div>

        <div className="p-6">
          {subscribed ? (
            <div className="text-center py-4">
              <p className="text-lg font-semibold text-accent mb-2">✓ Subscription Confirmed!</p>
              <p className="text-sm text-muted-foreground">You'll receive daily news digests at your selected times.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get curated news summaries delivered to your inbox twice daily.
              </p>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Digest Times</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={morningDigest}
                      onChange={(e) => setMorningDigest(e.target.checked)}
                      className="w-4 h-4 rounded border-input text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-foreground">Morning Digest (10:00 AM)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eveningDigest}
                      onChange={(e) => setEveningDigest(e.target.checked)}
                      className="w-4 h-4 rounded border-input text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-foreground">Evening Digest (6:00 PM)</span>
                  </label>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                <p className="font-semibold mb-1">You'll receive:</p>
                <ul className="space-y-1">
                  <li>• Top stories from Nigerian sources</li>
                  <li>• Daily Trust, TechCabal, Punch, ThisDay</li>
                  <li>• Sahara Reporters, Semafor coverage</li>
                  <li>• Curated by AI for relevance</li>
                </ul>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
