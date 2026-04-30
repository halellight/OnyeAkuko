"use client"

import { useState, useEffect, useRef } from "react"
import { X, Sun, Mail, Check, Loader2 } from "lucide-react"
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

    try {
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          digestTimes: { morning: true, evening: true }, // Defaulting to both for simple UI
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

  // Safely find index, fallback to 1 (normal) if not found
  const getFontSizeIndex = () => {
    const idx = FONT_SIZES.findIndex(f => f.id === fontSize)
    return idx === -1 ? 1 : idx
  }

  const ThemeMockup = ({ type }: { type: 'light' | 'system' | 'dark' }) => {
    return (
      <div className="w-full aspect-[1/1] rounded-[20px] overflow-hidden relative border-[1.5px] border-border shadow-sm flex items-stretch">
        {/* Background Split */}
        <div className={`absolute inset-0 flex ${type === 'dark' ? 'bg-[#444444]' : type === 'light' ? 'bg-[#f4f4f4]' : ''}`}>
          {type === 'system' && (
            <>
              <div className="flex-1 bg-[#f4f4f4]"></div>
              <div className="flex-1 bg-[#444444]"></div>
            </>
          )}
        </div>

        {/* Inner Phone Frame */}
        <div className="absolute inset-2 md:inset-3 rounded-2xl flex overflow-hidden shadow-sm">
          {/* Left Side (Light for Light & System, Dark for Dark) */}
          <div className={`flex-1 flex flex-col pt-3 px-2.5 gap-2.5 ${type === 'dark' ? 'bg-[#222222]' : 'bg-white'}`}>
             {/* Header */}
             <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="flex flex-wrap w-[18px] gap-[1px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-[#e59c6a]"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-[#e59c6a]"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-[#e59c6a]"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-[#e59c6a]"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-[#e59c6a]"></div>
                </div>
                {type === 'light' && <div className="w-4 h-4 rounded-full bg-black/10"></div>}
                {type === 'dark' && <div className="w-4 h-4 rounded-full bg-white/20"></div>}
             </div>
             {/* Pills */}
             <div className="flex gap-1.5 mt-1">
                <div className={`h-2.5 w-8 rounded-full ${type === 'dark' ? 'bg-white/10' : 'bg-black/5'}`}></div>
                <div className={`h-2.5 w-8 rounded-full ${type === 'dark' ? 'bg-white/10' : 'bg-black/5'}`}></div>
             </div>
             {/* Content Block */}
             <div className={`flex-1 rounded-t-xl mt-1 ${type === 'dark' ? 'bg-[#2a2a2a]' : 'bg-[#f8f9fa]'}`}></div>
          </div>

          {/* Right Side (Only used in System to show Dark mode) */}
          {type === 'system' && (
            <div className="flex-1 flex flex-col pt-3 px-2.5 gap-2.5 bg-[#222222]">
               {/* Header (Right aligned avatar) */}
               <div className="flex justify-end items-center h-[18px]">
                  <div className="w-4 h-4 rounded-full bg-[#d4d4d4]"></div>
               </div>
               {/* Pills */}
               <div className="flex gap-1.5 mt-1 h-2.5">
                  <div className="h-2.5 w-8 rounded-full bg-white/10"></div>
                  <div className="h-2.5 w-6 rounded-full bg-white/10"></div>
               </div>
               {/* Content Block */}
               <div className="flex-1 rounded-t-xl mt-1 bg-[#2a2a2a]"></div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />

      {/* Centered Modal */}
      <div
        ref={panelRef}
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[460px] max-h-[90vh] z-50 bg-background rounded-[32px] shadow-2xl transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col overflow-y-auto overflow-x-hidden ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        role="dialog"
        aria-label="Settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 sticky top-0 bg-background z-10 border-b border-border/30">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Settings</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close settings"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 px-8 py-8 flex flex-col gap-10">

          {/* ─── THEME ─── */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Sun className="h-5 w-5 text-[#e59c6a]" />
              <span className="text-[15px] text-muted-foreground font-medium">Theme</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "light", label: "Light", type: 'light' as const },
                { id: "system", label: "System", type: 'system' as const },
                { id: "dark", label: "Dark", type: 'dark' as const },
              ].map(({ id, label, type }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className={`w-full rounded-[24px] p-1.5 transition-all ${theme === id ? 'ring-2 ring-[#e59c6a] ring-offset-2 ring-offset-background' : 'hover:ring-2 hover:ring-border hover:ring-offset-2 hover:ring-offset-background'}`}>
                    <ThemeMockup type={type} />
                  </div>
                  <span className={`text-[15px] mt-1 ${theme === id ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="border-t border-border/50" />

          {/* ─── TEXT SIZE ─── */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#e59c6a] font-serif font-bold text-lg leading-none">B</span>
              <span className="text-[15px] text-muted-foreground font-medium">Text Size</span>
            </div>
            
            <div className="flex flex-col gap-5">
              {/* Aa Preview Box */}
              <div className="w-full h-36 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/50">
                <span className="font-bold text-foreground transition-all duration-300 tracking-tight" style={{ fontSize: FONT_SIZES[getFontSizeIndex()]?.scale ? `calc(${FONT_SIZES[getFontSizeIndex()].scale} * 2.8)` : '44px' }}>
                  Aa
                </span>
              </div>

              {/* Slider Control */}
              <div className="relative w-full h-[52px] bg-muted/50 rounded-2xl p-1.5 flex items-center border border-border/50">
                 {/* Sliding Indicator */}
                 <div 
                   className="absolute h-[40px] bg-[#e59c6a] rounded-xl transition-all duration-300 ease-out shadow-sm"
                   style={{ 
                     width: `calc((100% - 12px) / ${FONT_SIZES.length})`,
                     left: `calc(6px + (100% - 12px) / ${FONT_SIZES.length} * ${getFontSizeIndex()})`
                   }}
                 />
                 
                 {/* Clickable Areas & Ticks */}
                 {FONT_SIZES.map((size) => (
                   <button
                     key={size.id}
                     className="flex-1 h-full relative z-10 flex items-center justify-center cursor-pointer group"
                     onClick={() => handleFontSize(size.id)}
                     aria-label={`Set text size to ${size.label}`}
                   >
                     {/* Tick mark */}
                     <div className={`w-0.5 h-3.5 rounded-full transition-colors duration-300 ${fontSize === size.id ? 'bg-white' : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/60'}`} />
                   </button>
                 ))}
              </div>
            </div>
          </section>

          <div className="border-t border-border/50" />

          {/* ─── NEWSLETTER ─── */}
          <section className="pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-[#e59c6a]" />
              <span className="text-[15px] text-muted-foreground font-medium">Subscribe</span>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-4 py-5 px-6 rounded-2xl bg-[#4ade80]/10 border border-[#4ade80]/30">
                <Check className="h-6 w-6 text-[#4ade80] flex-shrink-0" />
                <div>
                  <p className="text-[15px] font-bold text-[#4ade80]">Subscribed!</p>
                  <p className="text-[13px] text-muted-foreground mt-0.5">You'll receive our digests soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <p className="text-[15px] text-muted-foreground mb-2 leading-relaxed">
                  Get curated Nigerian news delivered to your inbox.
                </p>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 rounded-xl px-4 py-6 text-[15px] bg-muted/30 border-border focus-visible:ring-1 focus-visible:ring-[#e59c6a]"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-[#e59c6a] text-black hover:bg-[#e59c6a]/90 h-[50px] px-6 font-bold transition-colors text-[15px]"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Join"}
                  </Button>
                </div>
                {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
              </form>
            )}
          </section>

        </div>
      </div>
    </>
  )
}
