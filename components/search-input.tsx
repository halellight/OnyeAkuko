"use client"

import type React from "react"
import { Search, X } from "lucide-react"

interface SearchInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value = "",
  onChange = () => {},
  placeholder = "Search articles, topics, sources...",
  className = ""
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2 text-base sm:text-sm rounded-full border border-border bg-background/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#e59c6a] transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          title="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
