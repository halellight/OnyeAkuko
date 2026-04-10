"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")
  const [morningDigest, setMorningDigest] = useState(true)
  const [eveningDigest, setEveningDigest] = useState(true)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener("open-newsletter", handleOpen)
    document.addEventListener("open-newsletter", handleOpen)
    return () => {
      window.removeEventListener("open-newsletter", handleOpen)
      document.removeEventListener("open-newsletter", handleOpen)
    }
  }, [])

  const onClose = () => setIsOpen(false)

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-700">
      <div className="relative w-full sm:max-w-2xl bg-[#f5f5f5] text-black shadow-2xl p-8 sm:p-12 animate-in slide-in-from-bottom-2 duration-700 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Close"
        >
          <span className="text-2xl leading-none">✕</span>
        </button>

        <div className="flex flex-col mt-2">
          <div className="flex items-center gap-2 mb-6 text-black">
            <span className="font-display text-2xl tracking-widest uppercase">OnyeAkụkọ</span>
            <span className="border border-black px-2 py-0.5 text-xs font-bold uppercase tracking-wider">Daily</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1] mb-6 font-satoshi">
            Subscribe to OnyeAkụkọ
          </h2>

          <p className="text-base sm:text-[17px] font-serif text-[#111] mb-8 leading-relaxed max-w-xl">
            Join 100+ readers getting curated intelligence, political analysis, and uncompromising news from OnyeAkụkọ.
          </p>

          <div className="w-full">
            {subscribed ? (
              <div className="text-left py-4 pb-8">
                <p className="text-xl font-black text-[#e59c6a] mb-2 uppercase tracking-wide">Subscription Confirmed!</p>
                <p className="text-base font-serif text-[#333]">You'll receive daily news digests at your selected times.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-6">

                {/* Input row */}
                <div className="flex flex-col sm:flex-row gap-0 border border-[#cccccc] bg-white">
                  <Input
                    type="email"
                    placeholder="Your email here..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full sm:flex-1 border-0 rounded-none px-4 py-6 text-base focus-visible:ring-0 focus-visible:ring-offset-0 text-black placeholder:text-[#888] font-serif"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-[#e59c6a] text-black hover:bg-[#e59c6a]/90 rounded-none px-8 py-6 text-sm font-bold tracking-wide transition-colors h-auto border-l border-[#cccccc]"
                  >
                    {loading ? "..." : "Sign up for free"}
                  </Button>
                </div>

                {error && <p className="text-sm font-bold text-red-600 uppercase tracking-widest">{error}</p>}

                {/* Checkboxes Area */}
                <div className="flex flex-col gap-4 mt-2 bg-white/50 p-4 border border-[#e5e5e5]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#555]">Select Digest Times:</p>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={morningDigest}
                        onChange={(e) => setMorningDigest(e.target.checked)}
                        className="w-5 h-5 rounded-none border-2 border-black text-[#e59c6a] focus:ring-[#e59c6a] focus:ring-offset-0 transition-colors"
                      />
                      <span className="text-sm font-bold text-black uppercase tracking-wider group-hover:text-[#e59c6a] transition-colors">Morning (10:00 AM)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={eveningDigest}
                        onChange={(e) => setEveningDigest(e.target.checked)}
                        className="w-5 h-5 rounded-none border-2 border-black text-[#e59c6a] focus:ring-[#e59c6a] focus:ring-offset-0 transition-colors"
                      />
                      <span className="text-sm font-bold text-black uppercase tracking-wider group-hover:text-[#e59c6a] transition-colors">Evening (6:00 PM)</span>
                    </label>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Featured Quote Component */}
          <div className="mt-8 pt-8 border-t border-[#d1d1d1] flex items-start gap-4">
            <img src="/favicon.ico" alt="Avatar" className="w-12 h-12 rounded-full border border-[#cccccc] bg-black object-contain" />
            <div className="flex flex-col">
              <p className="text-lg font-serif italic text-black mb-1 leading-snug">"OnyeAkụkọ. Intelligence Unfiltered. Daily."</p>
              <p className="text-sm font-bold text-black">— By Praise Ibe</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
