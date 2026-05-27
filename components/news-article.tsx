"use client"

import { Share2, ExternalLink, Clock } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

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

interface NewsArticleProps {
  title: string
  description: string
  source: string
  category: string
  sentiment: "positive" | "neutral" | "negative"
  date: string
  link: string
  credibility: number
  imageUrl: string
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

const BIAS_COLORS = {
  "government-aligned": "bg-[#ef4444] text-[#ef4444]", // Red
  "opposition-leaning": "bg-[#3b82f6] text-[#3b82f6]", // Blue
  "independent": "bg-[#10b981] text-[#10b981]", // Green
  "neutral": "bg-[#94a3b8] text-[#94a3b8]", // Slate/Gray
}

const BIAS_LABELS = {
  "government-aligned": "Govt-Aligned",
  "opposition-leaning": "Opposition-Leaning",
  "independent": "Independent",
  "neutral": "Mainstream",
}

export function NewsArticle({
  title,
  description,
  source,
  category,
  sentiment,
  date,
  link,
  credibility,
  imageUrl,
  articles = [],
  coverageCount = 1,
  biasDistribution = { government: 0, opposition: 0, independent: 0, neutral: 0 },
}: NewsArticleProps) {
  const [imageError, setImageError] = useState(false)
  const articleSlug = slugify(title)
  const articleHref = `/article/${encodeURIComponent(articleSlug)}`

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    const shareUrl = `${window.location.origin}${articleHref}`
    navigator.clipboard.writeText(shareUrl)
    toast.success("Article link copied! Redirects to OnyeAkụkọ.", {
      description: "You can now share this link."
    })
  }

  // Local storage logger for personal news diet tracking (Particle/Ground News style)
  const trackRead = () => {
    try {
      const stored = localStorage.getItem("onyeakuko_diet_clicks")
      const history = stored ? JSON.parse(stored) : []
      
      // Log this click with source biases
      const currentSources = articles.length > 0 ? articles : [{ source, bias: "neutral" }]
      currentSources.forEach((src: any) => {
        history.push({
          source: src.source,
          bias: src.bias || "neutral",
          timestamp: Date.now()
        })
      })
      
      // Limit to last 100 clicks
      if (history.length > 100) history.shift()
      localStorage.setItem("onyeakuko_diet_clicks", JSON.stringify(history))
      
      // Dispatch event to update analyzer widget dynamically
      window.dispatchEvent(new Event("onyeakuko_diet_updated"))
    } catch (e) {
      console.warn("localStorage tracking failed", e)
    }
  }

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-[#4ade80] bg-[#4ade80]/10 border-[#4ade80]/20"
      case "negative":
        return "text-[#f87171] bg-[#f87171]/10 border-[#f87171]/20"
      default:
        return "text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20"
    }
  }

  const formattedDate = new Date(date).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const noImage = !imageUrl || imageUrl === "N/A" || imageError

  // Calculate bias percentages for visual spectrum bar
  const totalBias = (biasDistribution.government || 0) + 
                    (biasDistribution.opposition || 0) + 
                    (biasDistribution.independent || 0) + 
                    (biasDistribution.neutral || 0) || 1
  
  const govPct = Math.round(((biasDistribution.government || 0) / totalBias) * 100)
  const oppPct = Math.round(((biasDistribution.opposition || 0) / totalBias) * 100)
  const indPct = Math.round(((biasDistribution.independent || 0) / totalBias) * 100)
  const neuPct = Math.round(((biasDistribution.neutral || 0) / totalBias) * 100)

  // Unique list of sources in this story cluster
  const uniqueSources = Array.from(new Set(articles.map((a: any) => a.source)))

  return (
    <article className="bg-transparent flex flex-col h-full group transition-colors duration-300 pb-6 border-b border-border">
      {/* Clickable image -> article detail page */}
      <Link href={articleHref} onClick={trackRead} className="block">
        <div className="relative w-full aspect-[16/9] bg-muted mb-4 overflow-hidden border-b border-border">
          <img
            src={noImage ? "/Group728.png" : imageUrl}
            alt={title}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${noImage ? "opacity-50 grayscale object-contain p-8" : ""}`}
          />
          <div className="absolute top-4 left-4">
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider border ${getSentimentStyles(sentiment)}`}>
              {sentiment}
            </span>
          </div>
          {coverageCount > 1 && (
            <div className="absolute bottom-4 right-4">
              <span className="text-[10px] px-2 py-1 bg-black/80 backdrop-blur-sm text-[#e59c6a] font-black uppercase tracking-widest border border-[#e59c6a]/30">
                {coverageCount} OUTLETS COMPARE
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-[#e59c6a] uppercase tracking-[0.2em]">
            {uniqueSources.length > 0 ? uniqueSources.slice(0, 3).join(" • ") + (uniqueSources.length > 3 ? ` +${uniqueSources.length - 3}` : "") : source}
          </span>
          <span className="w-1 h-1 rounded-full bg-border"></span>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{category}</span>
        </div>

        {/* Clickable title -> article detail page */}
        <Link href={articleHref} onClick={trackRead} className="block">
          <h3 className="text-[26px] sm:text-[28px] font-black text-foreground leading-[1.1] mb-4 group-hover:text-[#e59c6a] transition-colors tracking-tighter">
            {title}
          </h3>
        </Link>

        {/* --- Media Bias Spectrum (Ground News / Particle Inspired) --- */}
        <div className="mb-4 bg-muted/20 p-3.5 border border-border/60">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-2">
            <span className="text-muted-foreground">Media Coverage Spectrum</span>
            <span className="text-foreground text-[11px]">
              {coverageCount > 1 ? `${coverageCount} Sources` : BIAS_LABELS[articles[0]?.bias || "neutral"]}
            </span>
          </div>
          
          {/* Tri-color bias percentage track */}
          <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted/40 mb-2 border border-border/20">
            {govPct > 0 && <div style={{ width: `${govPct}%` }} className="bg-[#ef4444] h-full" title={`Government-Aligned: ${govPct}%`} />}
            {oppPct > 0 && <div style={{ width: `${oppPct}%` }} className="bg-[#3b82f6] h-full" title={`Opposition-Leaning: ${oppPct}%`} />}
            {indPct > 0 && <div style={{ width: `${indPct}%` }} className="bg-[#10b981] h-full" title={`Independent: ${indPct}%`} />}
            {neuPct > 0 && <div style={{ width: `${neuPct}%` }} className="bg-[#94a3b8] h-full" title={`Mainstream/Neutral: ${neuPct}%`} />}
          </div>

          {/* Micro-pills of sources involved */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {articles.slice(0, 4).map((art: any, i: number) => (
              <span key={i} className={`text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider bg-muted/60 text-foreground border-l-2 ${
                art.bias === "government-aligned" ? "border-[#ef4444]" :
                art.bias === "opposition-leaning" ? "border-[#3b82f6]" :
                art.bias === "independent" ? "border-[#10b981]" : "border-[#94a3b8]"
              }`}>
                {art.source}
              </span>
            ))}
            {articles.length > 4 && (
              <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider bg-[#e59c6a]/15 text-[#e59c6a]">
                +{articles.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div className="w-full border-b border-dashed border-border mb-4"></div>

        <p className="text-base text-muted-foreground line-clamp-3 mb-6 flex-1 leading-relaxed font-serif tracking-normal">
          {description}
        </p>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-5 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-foreground font-bold">{Math.round(credibility * 100)}%</span>
              <span className="opacity-50">Reliability</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center p-3.5 rounded-lg transition-all duration-300 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            title="Share via OnyeAkụkọ"
          >
            <Share2 className="h-4 w-4" />
          </button>
          {/* Primary action: open article detail page */}
          <Link
            href={articleHref}
            onClick={trackRead}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#e59c6a] hover:bg-[#e59c6a]/80 text-black transition-colors text-sm font-bold shadow-lg shadow-[#e59c6a]/20"
          >
            Compare Perspectives
          </Link>
        </div>
      </div>
    </article>
  )
}
