"use client"

import { Settings, User } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

const CATEGORIES = [
  { id: "all", label: "All Feed" },
  { id: "world", label: "World" },
  { id: "nigeria", label: "🇳🇬 Nigeria" },
  { id: "politics", label: "Politics" },
  { id: "technology", label: "Tech" },
  { id: "culture", label: "Culture" },
]

interface NewsHeaderProps {
  selectedCategory?: string;
  setSelectedCategory?: (value: string) => void;
}

export function NewsHeader({ selectedCategory = "all", setSelectedCategory = () => { } }: NewsHeaderProps) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const openSettings = () => {
    window.dispatchEvent(new Event("open-settings"))
    document.dispatchEvent(new Event("open-settings"))
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/80">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          
          {/* Brand Logo (Particle inspired) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="block select-none">
              <img
                src="/favicon.ico"
                alt="OnyeAkụkọ Logo"
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Category Navigation (Horizontal Pill Slider - Particle/Gesture style) */}
          <nav className="flex-1 max-w-xl md:max-w-2xl overflow-x-auto no-scrollbar flex items-center gap-1.5 py-1.5 px-2 select-none scroll-smooth">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full whitespace-nowrap transition-all duration-300 ease-out border ${
                    active
                      ? "bg-[#e59c6a] text-black border-[#e59c6a] shadow-sm shadow-[#e59c6a]/15 scale-95"
                      : "bg-muted/20 hover:bg-muted/65 text-muted-foreground hover:text-foreground border-border/10 hover:border-border/30"
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </nav>

          {/* Utility Right Actions */}
          <div className="flex-shrink-0 flex items-center gap-3">
            
            {/* Profile Avatar trigger (Supabase session aware) */}
            <button
              onClick={openSettings}
              title={user ? "Profile Settings" : "Sign In & Settings"}
              aria-label="Open settings"
              className="flex items-center justify-center transition-all p-0.5 rounded-full border border-border/40 hover:border-[#e59c6a]/50 bg-muted/20"
            >
              {user ? (
                user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-[#e59c6a]/20"
                  />
                ) : (
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#e59c6a]/15 text-[#e59c6a] flex items-center justify-center font-bold text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )
              ) : (
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-[#e59c6a] transition-colors">
                  <User className="h-4 w-4" />
                </div>
              )}
            </button>
            
          </div>
        </div>
      </div>
    </header>
  )
}
