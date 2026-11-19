"use client"

import { useEffect, useState } from "react"
import { ExternalLink, RefreshCw, AlertCircle, Newspaper } from "lucide-react"

interface BiasDistribution {
  government: number
  opposition: number
  independent: number
  neutral: number
}

interface ElectionStory {
  id: string
  title: string
  description: string
  source: string
  date: string
  link: string
  imageUrl?: string
  coverageCount?: number
  biasDistribution?: BiasDistribution
}

export default function ElectionEmbedWidget() {
  const [stories, setStories] = useState<ElectionStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchElectionNews = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch("/api/news/election?limit=6", {
        headers: { Accept: "application/json" },
      })
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      if (Array.isArray(data)) {
        setStories(data)
      } else if (data.data && Array.isArray(data.data)) {
        setStories(data.data)
      } else {
        throw new Error("Invalid format")
      }
    } catch (err) {
      console.error("[embed-election] Fetch error:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchElectionNews()
  }, [])

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const diffMs = Date.now() - date.getTime()
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHrs < 1) return "Just now"
      if (diffHrs < 24) return `${diffHrs}h ago`
      const diffDays = Math.floor(diffHrs / 24)
      return `${diffDays}d ago`
    } catch {
      return "Recent"
    }
  }

  return (
    <div className="w-full h-full bg-background text-foreground font-sans p-4 sm:p-5 rounded-2xl border border-border flex flex-col justify-between overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            2027 Election Updates
          </h2>
        </div>
        <a
          href="https://onyeakuko.online"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <span>Powered by <span className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-2">OnyeAkụkọ</span></span>
          <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* Content Area */}
      <div className="my-3 flex-1 overflow-y-auto space-y-3 pr-1 divide-y divide-border/40">
        {loading ? (
          <div className="h-44 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-xs font-medium">Fetching election updates...</span>
          </div>
        ) : error && stories.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center gap-2 text-center p-4">
            <AlertCircle className="w-6 h-6 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Could not load live news.</p>
            <a
              href="https://onyeakuko.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary font-semibold underline underline-offset-2"
            >
              Check OnyeAkụkọ directly
            </a>
          </div>
        ) : (
          stories.map((story) => (
            <article key={story.id} className="pt-3 first:pt-0 group">
              <a
                href={story.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-85 transition-opacity"
              >
                <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {story.title}
                </h3>
              </a>
              {story.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {story.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground flex-wrap">
                <span className="font-semibold text-foreground/80">{story.source}</span>
                <span>•</span>
                <span>{formatTimeAgo(story.date)}</span>
                {story.coverageCount && story.coverageCount > 1 && (
                  <>
                    <span>•</span>
                    <span className="bg-primary/10 text-primary font-medium px-1.5 py-0.5 rounded text-[10px]">
                      {story.coverageCount} sources
                    </span>
                  </>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Verified Nigerian Media Coverage</span>
        <a
          href="https://onyeakuko.online"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:underline font-medium inline-flex items-center gap-1"
        >
          View all coverage <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  )
}
