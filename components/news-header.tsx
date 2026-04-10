"use client"

import { NotificationBell } from "./notification-bell"

const CATEGORIES = [
  { id: "all", label: "All News" },
  { id: "world", label: "World News" },
  { id: "nigeria", label: "🇳🇬 Nigeria & Africa" },
  { id: "business", label: "Business & Economy" },
  { id: "technology", label: "Technology" },
  { id: "culture", label: "Culture & Lifestyle" },
  { id: "politics", label: "Politics" },
  { id: "science", label: "Science" },
]

interface NewsHeaderProps {
  selectedCategory?: string;
  setSelectedCategory?: (value: string) => void;
}

export function NewsHeader({ selectedCategory = "all", setSelectedCategory = () => { } }: NewsHeaderProps) {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src="/favicon.ico"
              alt="OnyeAkụkọ Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            />
            {/* <span className="hidden lg:block ml-2 text-lg text-white font-bold tracking-tight">OnyeAkụkọ</span> */}
          </div>

          {/* Category Navigation */}
          <nav className="flex-1 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-sm sm:text-base tracking-tighter font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <button
              onClick={() => {
                window.dispatchEvent(new Event('open-newsletter'))
                document.dispatchEvent(new Event('open-newsletter'))
              }}
              title="Subscribe"
              className="text-[#e59c6a] transition-colors p-1"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM22.539 12.086H1.46v9.844L12 17.55l10.539 4.38v-9.844zM1.46 1.562h21.08v2.836H1.46V1.562z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
