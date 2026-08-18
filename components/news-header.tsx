"use client"

import { Settings, User, Search, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

const CATEGORIES = [
  { id: "all", label: "All Feed" },
  { id: "nigeria", label: "🇳🇬 Nigeria" },
  { id: "world", label: "World" },
  { id: "politics", label: "Politics" },
  { id: "technology", label: "Tech" },
  { id: "culture", label: "Culture" },
]

interface NewsHeaderProps {
  selectedCategory?: string;
  setSelectedCategory?: (value: string) => void;
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
}

export function NewsHeader({
  selectedCategory = "all",
  setSelectedCategory = () => { },
  searchQuery = "",
  setSearchQuery = () => { }
}: NewsHeaderProps) {
  const [user, setUser] = useState<any>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Keyboard shortcut '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") ||
        (e.key === "k" && (e.metaKey || e.ctrlKey))
      ) {
        e.preventDefault()
        setIsSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 50)
      } else if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false)
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSearchOpen])

  const openSettings = () => {
    window.dispatchEvent(new Event("open-settings"))
    document.dispatchEvent(new Event("open-settings"))
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-border/80 transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-3 md:gap-4">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="block select-none">
              <img
                src="/favicon.ico"
                alt="OnyeAkụkọ Logo"
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Category Navigation (Horizontal Pill Slider) */}
          <nav className="hidden sm:flex flex-1 max-w-xl md:max-w-2xl overflow-x-auto no-scrollbar items-center gap-1.5 py-1.5 px-2 select-none scroll-smooth">
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

          {/* Search Bar & Profile Controls */}
          <div className="flex-1 sm:flex-none flex items-center justify-end gap-2 sm:gap-3">
            
            {/* Interactive Search Input Box */}
            <div className={`relative flex items-center transition-all duration-300 ${
              isSearchOpen || searchQuery
                ? "w-full sm:w-64 md:w-80"
                : "w-auto sm:w-48 md:w-64"
            }`}>
              <div className="relative w-full flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search stories, sources..."
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-12 py-1.5 sm:py-2 text-xs rounded-full bg-muted/20 hover:bg-muted/30 focus:bg-background border border-border/40 focus:border-[#e59c6a] text-foreground placeholder:text-muted-foreground focus:outline-none transition-all"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery ? (
                    <button
                      onClick={() => {
                        setSearchQuery("")
                        searchInputRef.current?.focus()
                      }}
                      className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Clear search"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-block text-[9px] font-mono text-muted-foreground bg-muted/40 border border-border/50 rounded px-1.5 py-0.2 pointer-events-none">
                      /
                    </kbd>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Avatar trigger */}
            <button
              onClick={openSettings}
              title={user ? "Profile Settings" : "Sign In & Settings"}
              aria-label="Open settings"
              className="flex items-center justify-center transition-all p-0.5 rounded-full border border-border/40 hover:border-[#e59c6a]/50 bg-muted/20 flex-shrink-0"
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

        {/* Mobile Category Navigation (below on mobile) */}
        <div className="flex sm:hidden overflow-x-auto no-scrollbar items-center gap-1 py-2 border-t border-border/40">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[9px] uppercase tracking-widest font-black px-3 py-1 rounded-full whitespace-nowrap transition-all border ${
                  active
                    ? "bg-[#e59c6a] text-black border-[#e59c6a]"
                    : "bg-muted/20 text-muted-foreground border-border/10"
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}

