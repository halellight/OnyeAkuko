"use client"

import Link from "next/link"
import { useState } from "react"

interface ClusteredArticle {
  id: string
  title: string
  description: string
  source: string
  category: string
  sentiment: "positive" | "neutral" | "negative"
  region: "global" | "africa" | "nigeria"
  date: string
  imageUrl: string
  link: string
  credibility: number
  bias: "government-aligned" | "opposition-leaning" | "independent" | "neutral"
}

interface SidebarArticleProps {
  title: string
  source: string
  date: string
  imageUrl: string
  link: string
  articles?: ClusteredArticle[]
  coverageCount?: number
  biasDistribution?: {
    government: number
    opposition: number
    independent: number
    neutral: number
  }
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)
}

export function SidebarArticle({
  title,
  source,
  date,
  imageUrl,
  articles = [],
  coverageCount = 1,
  biasDistribution = { government: 0, opposition: 0, independent: 0, neutral: 0 },
}: SidebarArticleProps) {
  const [imageError, setImageError] = useState(false)
  const articleSlug = slugify(title)
  const articleHref = `/article/${encodeURIComponent(articleSlug)}`

  // Local storage logging
  const trackRead = () => {
    try {
      const stored = localStorage.getItem("onyeakuko_diet_clicks")
      const history = stored ? JSON.parse(stored) : []
      
      const currentSources = articles.length > 0 ? articles : [{ source, bias: "neutral" }]
      currentSources.forEach((src: any) => {
        history.push({
          source: src.source,
          bias: src.bias || "neutral",
          timestamp: Date.now()
        })
      })
      
      if (history.length > 100) history.shift()
      localStorage.setItem("onyeakuko_diet_clicks", JSON.stringify(history))
      
      window.dispatchEvent(new Event("onyeakuko_diet_updated"))
    } catch (e) {
      console.warn("localStorage tracking failed", e)
    }
  }

  const formattedDate = new Date(date).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  })

  const noImage = !imageUrl || imageUrl === "N/A" || imageError

  return (
    <article className="group flex gap-4 items-start py-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors rounded-lg px-2 -mx-2">
      <Link href={articleHref} onClick={trackRead} className="flex-1 flex flex-col justify-center min-w-0">
        <h4 className="text-base font-bold text-foreground leading-tight mb-2 group-hover:text-[#e59c6a] transition-colors line-clamp-3">
          {title}
        </h4>
        <div className="flex items-center flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className="font-bold text-foreground/80 flex items-center gap-1.5">
             <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-black overflow-hidden">
                {(source || "N").charAt(0)}
             </div>
             {source || "Independent"}
          </span>
          <span>•</span>
          <span>{formattedDate}</span>
          {coverageCount > 1 && (
            <>
              <span>•</span>
              <span className="text-[10px] bg-[#e59c6a]/15 text-[#e59c6a] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                {coverageCount} Outlets
              </span>
            </>
          )}
        </div>
      </Link>
      
      {!noImage && (
        <Link href={articleHref} onClick={trackRead} className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}
    </article>
  )
}
