"use client"

import { Share2, ExternalLink, Clock, Newspaper } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

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

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    const shareUrl = `${window.location.origin}/?article=${encodeURIComponent(title.replace(/\s+/g, '-').toLowerCase())}`
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

  return (
    <article className="bg-transparent flex flex-col h-full group hover:bg-white/[0.02] transition-colors duration-300 pb-6 border-b border-[#222]">
      <div className="relative w-full aspect-[16/9] bg-[#1a1a1a] mb-4 overflow-hidden border-b border-[#333]">
        <img
          src={(!imageUrl || imageUrl === "N/A" || imageError) ? "/Group728.png" : imageUrl}
          alt={title}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${(!imageUrl || imageUrl === "N/A" || imageError) ? "opacity-60 grayscale object-contain p-8" : ""}`}
        />
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider border ${getSentimentStyles(sentiment)}`}>
            {sentiment}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-[#e59c6a] uppercase tracking-[0.2em]">{source}</span>
          <span className="w-1 h-1 rounded-full bg-[#3e3e3e]"></span>
          <span className="text-[11px] font-medium text-[#6e6e6e] uppercase tracking-wider">{category}</span>
        </div>

        <h3 className="text-[26px] sm:text-[28px] font-black text-white leading-[1.1] mb-5 group-hover:text-[#e59c6a] transition-colors tracking-tighter">
          {title}
        </h3>

        <div className="w-full border-b border-dotted border-[#444] mb-4"></div>

        <p className="text-base text-[#a1a1a1] line-clamp-3 mb-6 flex-1 leading-relaxed font-serif tracking-normal">
          {description}
        </p>

        <div className="flex items-center justify-between text-[11px] text-[#6e6e6e] mb-5 pt-4 border-t border-[#2e2e2e]">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-white font-bold">{Math.round(credibility * 100)}%</span>
              <span className="opacity-50">Reliability</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center p-3.5 rounded-lg transition-all duration-300 bg-[#2a2a2a] text-[#9e9e9e] hover:bg-[#323232] hover:text-white"
            title="Share via OnyeAkụkọ"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#e59c6a] hover:bg-[#e59c6a]/80 text-black transition-colors text-sm font-bold shadow-lg shadow-[#e59c6a]/20"
          >
            Read Full Article <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  )
}
