"use client"

import { Bookmark, ExternalLink, Clock, Newspaper } from "lucide-react"
import { useState } from "react"

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
  const [isBookmarked, setIsBookmarked] = useState(false)

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
    <article className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-xl overflow-hidden hover:border-[#e59c6a]/50 transition-all duration-300 h-full flex flex-col group hover:shadow-2xl hover:shadow-[#e59c6a]/5">
      <div className="relative w-full h-52 bg-[#1a1a1a] overflow-hidden">
        {imageUrl && imageUrl !== "N/A" && !imageUrl.includes("default.jpg") ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] text-[#4a4a4a]">
            <Newspaper className="h-12 w-12 mb-2 opacity-20" />
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Intelligence Report</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider border ${getSentimentStyles(sentiment)}`}>
            {sentiment}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-[#e59c6a] uppercase tracking-[0.2em]">{source}</span>
          <span className="w-1 h-1 rounded-full bg-[#3e3e3e]"></span>
          <span className="text-[10px] font-medium text-[#6e6e6e] uppercase tracking-wider">{category}</span>
        </div>

        <h3 className="text-lg font-bold text-white line-clamp-2 mb-3 leading-snug group-hover:text-[#e59c6a] transition-colors">{title}</h3>

        <p className="text-sm text-[#9e9e9e] line-clamp-3 mb-6 flex-1 leading-relaxed">{description}</p>

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
            onClick={(e) => {
              e.preventDefault()
              setIsBookmarked(!isBookmarked)
            }}
            className={`flex items-center justify-center p-2.5 rounded-lg transition-all duration-300 ${isBookmarked
              ? "bg-[#e59c6a] text-white"
              : "bg-[#2a2a2a] text-[#9e9e9e] hover:bg-[#323232] hover:text-white"
              }`}
          >
            <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-white text-black hover:bg-[#e59c6a] hover:text-white transition-all duration-300"
          >
            Read Full Article <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  )
}
