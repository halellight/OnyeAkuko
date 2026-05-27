"use client"

import { Share2, Clock } from "lucide-react"
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

interface HeroArticleProps {
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

const BIAS_LABELS = {
  "government-aligned": "Govt-Aligned",
  "opposition-leaning": "Opposition-Leaning",
  "independent": "Independent",
  "neutral": "Mainstream",
}

export function HeroArticle({
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
}: HeroArticleProps) {
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

  // Local storage tracking for News Diet Analyzer
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
    year: "numeric",
  })

  const noImage = !imageUrl || imageUrl === "N/A" || imageError

  // Calculate bias percentages
  const totalBias = (biasDistribution.government || 0) + 
                    (biasDistribution.opposition || 0) + 
                    (biasDistribution.independent || 0) + 
                    (biasDistribution.neutral || 0) || 1
  
  const govPct = Math.round(((biasDistribution.government || 0) / totalBias) * 100)
  const oppPct = Math.round(((biasDistribution.opposition || 0) / totalBias) * 100)
  const indPct = Math.round(((biasDistribution.independent || 0) / totalBias) * 100)
  const neuPct = Math.round(((biasDistribution.neutral || 0) / totalBias) * 100)

  const uniqueSources = Array.from(new Set(articles.map((a: any) => a.source)))

  return (
    <article className="group relative w-full h-[550px] md:h-[650px] overflow-hidden bg-muted transition-transform duration-300 hover:-translate-y-1">
      <Link href={articleHref} onClick={trackRead} className="block w-full h-full">
        {/* Background Image */}
        <img
          src={noImage ? "/Group728.png" : imageUrl}
          alt={title}
          onError={() => setImageError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${noImage ? "opacity-50 grayscale object-contain p-12" : ""}`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent opacity-95 transition-opacity group-hover:opacity-100" />

        {/* Content */}
        <div className="absolute inset-0 p-6 md:p-8 lg:p-10 flex flex-col justify-end">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 border border-white/10">
              <span className="text-[10px] md:text-xs font-bold text-[#e59c6a] uppercase tracking-[0.2em]">
                {uniqueSources.length > 0 ? uniqueSources.slice(0, 3).join(" • ") + (uniqueSources.length > 3 ? ` +${uniqueSources.length - 3}` : "") : source}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              <span className="text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider">{category}</span>
            </div>
            {coverageCount > 1 && (
              <span className="text-[9px] md:text-[10px] px-2 py-1 bg-[#e59c6a] text-black font-black uppercase tracking-widest">
                {coverageCount}-Perspective Story
              </span>
            )}
          </div>

          <h3 className="text-3xl md:text-4xl lg:text-[46px] font-black text-white leading-[1.05] mb-4 md:mb-6 tracking-tighter drop-shadow-md group-hover:text-[#e59c6a] transition-colors">
            {title}
          </h3>

          <p className="text-white/85 text-base md:text-[17px] line-clamp-2 md:line-clamp-3 mb-6 max-w-3xl font-serif leading-relaxed">
            {description}
          </p>

          {/* --- Ground News style Spectrum Overlay Bar --- */}
          <div className="mb-6 max-w-xl bg-white/5 backdrop-blur-md p-3.5 border border-white/10">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">
              <span>Coverage Bias Spectrum</span>
              <span className="text-white">
                {coverageCount > 1 ? `${coverageCount} Media Outlets` : BIAS_LABELS[articles[0]?.bias || "neutral"]}
              </span>
            </div>

            {/* Visual spectrum indicator bar */}
            <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-white/10 mb-2">
              {govPct > 0 && <div style={{ width: `${govPct}%` }} className="bg-[#ef4444] h-full" />}
              {oppPct > 0 && <div style={{ width: `${oppPct}%` }} className="bg-[#3b82f6] h-full" />}
              {indPct > 0 && <div style={{ width: `${indPct}%` }} className="bg-[#10b981] h-full" />}
              {neuPct > 0 && <div style={{ width: `${neuPct}%` }} className="bg-[#94a3b8] h-full" />}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {articles.slice(0, 5).map((art: any, i: number) => (
                <span key={i} className={`text-[8.5px] px-1.5 py-0.5 font-bold uppercase tracking-widest bg-white/5 text-white/90 border-l-2 ${
                  art.bias === "government-aligned" ? "border-[#ef4444]" :
                  art.bias === "opposition-leaning" ? "border-[#3b82f6]" :
                  art.bias === "independent" ? "border-[#10b981]" : "border-[#94a3b8]"
                }`}>
                  {art.source}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-white/60 text-xs md:text-sm pt-4 border-t border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <span className="text-white font-bold">{Math.round(credibility * 100)}%</span>
                <span>Reliability</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 p-2 px-4 rounded-lg transition-colors bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
              >
                <Share2 className="h-4 w-4" />
                <span className="font-bold hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
