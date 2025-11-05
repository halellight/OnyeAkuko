"use client"

import type React from "react"

import { useState } from "react"

export function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Search for:", searchTerm)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <span className="absolute left-3 top-2.5 text-muted-foreground">🔍</span>
      <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </form>
  )
}
