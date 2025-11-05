"use client"

import { SearchInput } from "./search-input"
import { NotificationBell } from "./notification-bell"

export function NewsHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">📰</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">NewsHub</h1>
              <p className="text-sm text-muted-foreground">AI-Powered News Curator</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <SearchInput />
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <span className="text-muted-foreground text-lg">⚙️</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
