"use client"

import { useState, useEffect, useRef } from "react"
import { X, Sun, Mail, Check, Loader2, User, LogIn, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

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
  const [digestTimes, setDigestTimes] = useState({ morning: true, evening: true })

  // Auth States
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const panelRef = useRef<HTMLDivElement>(null)

  // Auth Effects
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    setAuthLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      })
      if (error) throw error
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in with Google")
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    setAuthLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success("Successfully signed out")
    } catch (err: any) {
      toast.error(err.message || "Failed to sign out")
    } finally {
      setAuthLoading(false)
    }
  }

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
          digestTimes,
        }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || "Failed to subscribe")
      }
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 4000)
    } catch (err: any) {
      setError(err.message || "Failed to subscribe. Please try again.")
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

          {/* ─── GOOGLE AUTH PROFILE ─── */}
          <section>
            {authLoading ? (
              <div className="w-full h-24 rounded-2xl bg-muted/40 animate-pulse flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : user ? (
              <div className="bg-[#e59c6a]/5 p-5 rounded-2xl border border-[#e59c6a]/20 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Profile" className="w-9 h-9 rounded-full border border-[#e59c6a]/30 object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#e59c6a]/20 text-[#e59c6a] flex items-center justify-center font-bold text-sm">
                        {user.email?.charAt(0).toUpperCase() || "R"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {user.user_metadata?.full_name || user.email?.split("@")[0] || "Reader"}
                      </h4>
                      <p className="text-[10px] text-muted-foreground truncate font-serif">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-[#e59c6a]/10 text-[#e59c6a] font-bold uppercase tracking-widest rounded-sm border border-[#e59c6a]/20 flex-shrink-0">
                    Verified Reader
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-destructive/5 hover:bg-destructive/10 text-destructive border border-destructive/10 transition-colors rounded-xl font-bold text-xs"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-[#e59c6a] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Your Profile</h4>
                    <p className="text-xs text-muted-foreground font-serif leading-relaxed mt-0.5">
                      Sign in to analyze your reading diet, unlock local perspectives, and manage custom notifications.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-border bg-card hover:bg-muted/40 text-foreground transition-all rounded-xl font-bold text-sm shadow-sm"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v2.7h5.38C16.88,15.6,14.77,17,12,17c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.66,0,3.14,0.67,4.24,1.76l2.12-2.12C16.53,2.83,14.38,2,12,2C7.03,2,3,6.03,3,11s4.03,9,9,9c4.97,0,9-4.03,9-9C21,11.55,20.85,11.1,21.35,11.1z" fill="#4285F4"/>
                      <path d="M12,20c2.38,0,4.53-0.83,6.12-2.24l-2.12-2.12C14.77,16.33,13.44,17,12,17c-2.31,0-4.27-1.46-5.07-3.56L4.76,15.06C6.27,18.01,9.39,20,12,20z" fill="#34A853"/>
                      <path d="M6.93,13.44C6.72,12.78,6.6,12.09,6.6,11.4c0-0.69,0.12-1.38,0.33-2.04L4.76,7.74C3.89,9.45,3.4,11.37,3.4,13.4c0,2.03,0.49,3.95,1.36,5.66L6.93,13.44z" fill="#FBBC05"/>
                      <path d="M12,5.6c1.44,0,2.77,0.67,3.88,1.76l2.12-2.12C16.53,3.83,14.38,3,12,3C9.39,3,6.27,4.99,4.76,7.94l2.17,1.62C7.73,7.46,9.69,5.6,12,5.6z" fill="#EA4335"/>
                    </g>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            )}
          </section>

          <div className="border-t border-border/50" />

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
                
                <div className="flex gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => setDigestTimes(prev => ({ ...prev, morning: !prev.morning }))}
                    className={`flex-1 py-2.5 text-[13px] font-bold border rounded-none transition-colors ${digestTimes.morning ? 'bg-[#e59c6a] text-black border-[#e59c6a]' : 'bg-transparent text-muted-foreground border-border hover:bg-muted/30'}`}
                  >
                    Morning Digest
                  </button>
                  <button
                    type="button"
                    onClick={() => setDigestTimes(prev => ({ ...prev, evening: !prev.evening }))}
                    className={`flex-1 py-2.5 text-[13px] font-bold border rounded-none transition-colors ${digestTimes.evening ? 'bg-[#e59c6a] text-black border-[#e59c6a]' : 'bg-transparent text-muted-foreground border-border hover:bg-muted/30'}`}
                  >
                    Evening Digest
                  </button>
                </div>

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
