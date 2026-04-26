"use client"

import { Share2, ExternalLink, Clock } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

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
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)
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

  return (
    <article className="bg-transparent flex flex-col h-full group transition-colors duration-300 pb-6 border-b border-border">
      {/* Clickable image -> article detail page */}
      <Link href={articleHref} className="block">
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
        </div>
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-[#e59c6a] uppercase tracking-[0.2em]">{source}</span>
          <span className="w-1 h-1 rounded-full bg-border"></span>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{category}</span>
        </div>

        {/* Clickable title -> article detail page */}
        <Link href={articleHref} className="block">
          <h3 className="text-[26px] sm:text-[28px] font-black text-foreground leading-[1.1] mb-5 group-hover:text-[#e59c6a] transition-colors tracking-tighter">
            {title}
          </h3>
        </Link>

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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#e59c6a] hover:bg-[#e59c6a]/80 text-black transition-colors text-sm font-bold shadow-lg shadow-[#e59c6a]/20"
          >
            Read Story
          </Link>
          {/* Secondary: open original source */}
          {/* <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            title="Read original source"
            className="flex items-center justify-center p-3.5 rounded-lg transition-all duration-300 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
          </a> */}
        </div>
      </div>
    </article>
  )
}
