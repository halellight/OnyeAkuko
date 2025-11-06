"use client"

import { NotificationBell } from "./notification-bell"

export function NewsHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative flex items-center justify-center">
          {/* Centered title */}
          <div className="flex flex-col items-center gap-2.5">
            <h1 className="text-6xl font-bold font-stretch-ultra-condensed font-satoshi text-foreground">
              OnyeAkụkọ
            </h1>
            <p className="text-m text-muted-foreground">AI-Powered News Curator</p>
          </div>

          {/* Notification bell on the right */}
          <div className="absolute right-0 flex items-center gap-4">
            <NotificationBell />
          </div>
        </div>
      </div>
    </header>
  )
}
