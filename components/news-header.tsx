"use client"

import { Settings } from "lucide-react"

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
  const openSettings = () => {
    window.dispatchEvent(new Event("open-settings"))
    document.dispatchEvent(new Event("open-settings"))
  }

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
          </div>

          {/* Category Navigation */}
          <nav className="flex-1 flex items-center justify-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-2">
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
          <div className="flex-shrink-0 flex items-center gap-3">
            <button
              onClick={openSettings}
              title="Settings"
              aria-label="Open settings"
              className="text-[#e59c6a] hover:text-[#e59c6a]/80 transition-colors p-1.5 hover:bg-[#e59c6a]/10 rounded-full"
            >
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
