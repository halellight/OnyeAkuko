// AD SLOT COMPONENT — Commented out for now, activate when ready for monetization
// To enable: remove the comment wrapper and import in news-grid.tsx / article page

/*
"use client"

interface AdSlotProps {
  position: "feed-top" | "feed-mid" | "article-bottom" | "sidebar"
  size?: "banner" | "rectangle" | "leaderboard"
  adCode?: string
  showPlaceholder?: boolean
}

export function AdSlot({ position, size = "rectangle", adCode, showPlaceholder = true }: AdSlotProps) {
  if (!adCode && !showPlaceholder) return null

  if (adCode) {
    return (
      <div
        className="ad-slot w-full overflow-hidden"
        data-ad-position={position}
        dangerouslySetInnerHTML={{ __html: adCode }}
      />
    )
  }

  // Placeholder mode
  const sizeClasses = {
    banner: "h-16",
    rectangle: "h-40",
    leaderboard: "h-24",
  }

  return (
    <div
      className={`w-full ${sizeClasses[size]} border border-dashed border-[#333] flex items-center justify-center my-6`}
      data-ad-position={position}
    >
      <span className="text-xs text-[#555] uppercase tracking-widest font-bold">Advertisement</span>
    </div>
  )
}
*/

// Export a no-op so imports don't break
export function AdSlot(_props: Record<string, unknown>) {
  return null
}
