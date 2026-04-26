"use client"

import { useState, useEffect, useRef } from "react"
import { X, Sun, Moon, Type, Mail, Check, Loader2, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const FONT_SIZES = [
  { id: "small", label: "Small", scale: "14px" },
  { id: "normal", label: "Normal", scale: "16px" },
  { id: "large", label: "Large", scale: "18px" },
  { id: "xl", label: "X-Large", scale: "20px" },
]

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState("normal")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Newsletter state
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")
  const [morningDigest, setMorningDigest] = useState(true)
  const [eveningDigest, setEveningDigest] = useState(true)

  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const savedSize = localStorage.getItem("onyeakuko-font-size") || "normal"
    setFontSize(savedSize)
    applyFontSize(savedSize)
  }, [])

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener("open-settings", handleOpen)
    document.addEventListener("open-settings", handleOpen)
    return () => {
      window.removeEventListener("open-settings", handleOpen)
      document.removeEventListener("open-settings", handleOpen)
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  function applyFontSize(size: string) {
    const found = FONT_SIZES.find((f) => f.id === size)
    if (found) {
      document.documentElement.style.setProperty("--base-font-size", found.scale)
    }
  }

  function handleFontSize(size: string) {
    setFontSize(size)
    localStorage.setItem("onyeakuko-font-size", size)
    applyFontSize(size)
  }

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
          digestTimes: { morning: morningDigest, evening: eveningDigest },
        }),
      })
      if (!response.ok) throw new Error("Failed to subscribe")
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 4000)
    } catch {
      setError("Failed to subscribe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 bg-background border-l border-border shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-label="Settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg tracking-widest uppercase text-foreground">Settings</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close settings"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 flex flex-col gap-8">

          {/* ─── THEME ─── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sun className="h-4 w-4 text-[#e59c6a]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Theme</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "light", label: "Light", icon: Sun },
                { id: "dark", label: "Dark", icon: Moon },
                { id: "system", label: "System", icon: Monitor },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className={`flex flex-col items-center gap-2 p-4 border transition-all duration-200 ${theme === id
                    ? "border-[#e59c6a] bg-[#e59c6a]/10 text-[#e59c6a]"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-[#e59c6a]/50 hover:text-foreground"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="border-t border-border" />

          {/* ─── ACCESSIBILITY ─── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Type className="h-4 w-4 text-[#e59c6a]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Text Size</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleFontSize(size.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 border transition-all duration-200 ${fontSize === size.id
                    ? "border-[#e59c6a] bg-[#e59c6a]/10 text-[#e59c6a]"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-[#e59c6a]/50 hover:text-foreground"
                    }`}
                >
                  <span
                    className="font-bold leading-none"
                    style={{ fontSize: size.scale }}
                  >
                    A
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{size.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Adjust text size across all articles for better readability.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* ─── NEWSLETTER ─── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-4 w-4 text-[#e59c6a]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Newsletter</span>
            </div>

            <p className="text-sm text-muted-foreground mb-5 leading-relaxed font-serif">
              Get curated Nigerian & world news delivered to your inbox — morning &amp; evening digests.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-3 py-4 px-4 bg-[#4ade80]/10 border border-[#4ade80]/30">
                <Check className="h-5 w-5 text-[#4ade80] flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[#4ade80] uppercase tracking-wide">Subscribed!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">You&apos;ll receive daily digests at your selected times.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                <div className="flex flex-col gap-0 border border-border">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-0 rounded-none px-4 py-5 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground font-serif bg-transparent text-foreground caret-foreground"
                    style={{ fontSize: '16px' }}
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="rounded-none bg-[#e59c6a] text-black hover:bg-[#e59c6a]/80 py-5 text-xs font-bold tracking-widest uppercase h-auto transition-colors"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe For Free"}
                  </Button>
                </div>

                {error && (
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{error}</p>
                )}

                <div className="flex flex-col gap-3 bg-muted/30 p-4 border border-border">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Digest Times</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { key: "morning", label: "Morning — 10:00 AM", checked: morningDigest, onChange: setMorningDigest },
                      { key: "evening", label: "Evening — 6:00 PM", checked: eveningDigest, onChange: setEveningDigest },
                    ].map(({ key, label, checked, onChange }) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer group">
                        <div
                          className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked
                            ? "border-[#e59c6a] bg-[#e59c6a]"
                            : "border-border group-hover:border-[#e59c6a]/50"
                            }`}
                          onClick={() => onChange(!checked)}
                        >
                          {checked && <Check className="h-2.5 w-2.5 text-black" />}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-[#e59c6a] transition-colors">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            OnyeAkụkọ · Intelligence Unfiltered
          </p>
          <a
            href="https://x.com/_Onyeakuko"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-[#e59c6a] transition-colors uppercase tracking-widest flex-shrink-0"
            aria-label="Follow OnyeAkụkọ on X"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            @_Onyeakuko
          </a>
        </div>
      </div>
    </>
  )
}
