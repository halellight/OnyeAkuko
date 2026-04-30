"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Share2, Clock, Sparkles, Loader2, ChevronRight, Check } from "lucide-react"

interface Article {
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
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)
}

const SENTIMENT_STYLES = {
  positive: "text-[#4ade80] bg-[#4ade80]/10 border-[#4ade80]/30",
  negative: "text-[#f87171] bg-[#f87171]/10 border-[#f87171]/30",
  neutral: "text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/30",
}

// ─── Skeleton loader for article detail page ───
function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Minimal top bar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="h-4 w-16 bg-muted rounded-full" />
          <div className="h-4 w-28 bg-muted rounded-full" />
          <div className="h-4 w-12 bg-muted rounded-full" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Meta pills */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-3 w-20 bg-muted rounded-full" />
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="h-3 w-16 bg-muted rounded-full" />
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="h-5 w-14 bg-muted rounded-full" />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="h-9 w-full bg-muted rounded-sm" />
          <div className="h-9 w-5/6 bg-muted rounded-sm" />
          <div className="h-9 w-3/4 bg-muted rounded-sm" />
        </div>

        {/* Date */}
        <div className="h-3 w-40 bg-muted rounded-full mb-8" />

        {/* Hero image */}
        <div className="w-full aspect-[16/9] bg-muted mb-10 relative overflow-hidden border border-border">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
        </div>

        {/* TL;DR skeleton */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-4 bg-[#e59c6a]/30 rounded-sm" />
            <div className="h-3 w-48 bg-muted rounded-full" />
          </div>
          <div className="border border-border bg-muted/20 p-6 flex flex-col gap-3">
            <div className="h-4 w-full bg-muted rounded-full" />
            <div className="h-4 w-full bg-muted rounded-full" />
            <div className="h-4 w-4/5 bg-muted rounded-full" />
            <div className="mt-2 h-4 w-full bg-muted rounded-full" />
            <div className="h-4 w-3/4 bg-muted rounded-full" />
          </div>
        </div>

        <div className="border-t border-dashed border-border mb-10" />

        {/* Source card skeleton */}
        <div className="mb-12">
          <div className="h-3 w-28 bg-muted rounded-full mb-3" />
          <div className="border border-border p-5 flex items-start gap-4 bg-muted/20">
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 w-16 bg-muted rounded-full" />
              <div className="h-4 w-full bg-muted rounded-sm" />
              <div className="h-3 w-24 bg-muted rounded-full" />
            </div>
            <div className="h-4 w-4 bg-muted rounded-sm flex-shrink-0 mt-1" />
          </div>
        </div>

        <div className="border-t border-border mb-10" />

        {/* More stories skeleton */}
        <div className="h-6 w-44 bg-muted rounded-sm mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4 py-5 border-b border-border">
            <div className="flex-shrink-0 w-20 h-16 bg-muted border border-border" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-2.5 w-24 bg-muted rounded-full" />
              <div className="h-4 w-full bg-muted rounded-sm" />
              <div className="h-4 w-4/5 bg-muted rounded-sm" />
              <div className="h-3 w-3/4 bg-muted rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const slug = decodeURIComponent((params?.id as string) || "")

  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [summary, setSummary] = useState<string>("")
  const [isAI, setIsAI] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [shared, setShared] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/news?_t=${Date.now()}`)
      const all: Article[] = await res.json()

      const found = Array.isArray(all)
        ? all.find((a) => slugify(a.title) === slug) || null
        : null

      setArticle(found)

      if (found && Array.isArray(all)) {
        const related = all
          .filter((a) => a.id !== found.id && a.category === found.category)
          .slice(0, 4)
        setRelatedArticles(related.length >= 2 ? related : all.filter((a) => a.id !== found.id).slice(0, 4))
      }
    } catch (err) {
      console.error("[ArticlePage] Failed to fetch:", err)
      setArticle(null)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Fetch AI summary once article is loaded
  useEffect(() => {
    if (!article) return
    setSummaryLoading(true)

    fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: article.title, description: article.description }),
    })
      .then((r) => r.json())
      .then((data) => {
        setSummary(data.summary || article.description)
        setIsAI(data.isAI ?? false)
      })
      .catch(() => {
        setSummary(article.description)
        setIsAI(false)
      })
      .finally(() => setSummaryLoading(false))
  }, [article])

  // ── Share: native sheet on mobile, clipboard fallback on desktop ──
  const handleShare = async () => {
    const url = window.location.href
    const title = article?.title || "OnyeAkụkọ"

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
        return
      } catch {
        // user cancelled — do nothing
        return
      }
    }

    // Desktop fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url)
      setShared(true)
      setTimeout(() => setShared(false), 2500)
    } catch {
      // silent fail
    }
  }

  if (loading) return <ArticleSkeleton />

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-2xl font-black text-foreground uppercase tracking-tight">Article not found</p>
        <p className="text-muted-foreground font-serif text-center">This story may have been removed or the link has expired.</p>
        <Link href="/" className="mt-4 flex items-center gap-2 text-[#e59c6a] font-bold uppercase tracking-widest text-sm hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(article.date).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal top bar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <Link href="/" className="font-display text-base tracking-widest uppercase text-foreground">
            OnyeAkụkọ
          </Link>

          {/* Share button — native sheet on mobile, clipboard on desktop */}
          <button
            onClick={handleShare}
            className={`flex items-center gap-2 transition-colors text-sm font-bold uppercase tracking-wider ${shared ? "text-[#4ade80]" : "text-muted-foreground hover:text-foreground"}`}
          >
            {shared
              ? <><Check className="h-4 w-4" /><span className="hidden sm:inline">Copied!</span></>
              : <><Share2 className="h-4 w-4" /><span className="hidden sm:inline">Share</span></>
            }
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Meta */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="text-xs font-bold text-[#e59c6a] uppercase tracking-[0.2em]">{article.source}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{article.category}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${SENTIMENT_STYLES[article.sentiment]}`}>
            {article.sentiment}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground leading-[1.05] tracking-tighter mb-6">
          {article.title}
        </h1>

        {/* Date */}
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-8">
          <Clock className="h-3.5 w-3.5" />
          <span>{formattedDate}</span>
        </div>

        {/* Hero Image */}
        <div className="w-full aspect-[16/9] bg-muted overflow-hidden mb-10 border border-border">
          <img
            src={(!article.imageUrl || article.imageUrl === "N/A" || imageError) ? "/Group728.png" : article.imageUrl}
            alt={article.title}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover ${(!article.imageUrl || article.imageUrl === "N/A" || imageError) ? "opacity-50 grayscale object-contain p-12" : ""}`}
          />
        </div>

        {/* ─── TL;DR / AI SUMMARY SECTION ─── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-[#e59c6a]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e59c6a]">
              TL;DR — Summarized with AI
            </span>
            {!isAI && !summaryLoading && (
              <span className="text-[10px] px-2 py-0.5 border border-border text-muted-foreground uppercase tracking-wider font-bold">
                Preview
              </span>
            )}
          </div>

          <div className="border border-[#e59c6a]/30 bg-[#e59c6a]/5 p-6">
            {summaryLoading ? (
              <div className="flex flex-col gap-3 animate-pulse">
                <div className="h-4 w-full bg-[#e59c6a]/20 rounded-full" />
                <div className="h-4 w-full bg-[#e59c6a]/20 rounded-full" />
                <div className="h-4 w-4/5 bg-[#e59c6a]/20 rounded-full" />
                <div className="mt-1 h-4 w-full bg-[#e59c6a]/20 rounded-full" />
                <div className="h-4 w-3/4 bg-[#e59c6a]/20 rounded-full" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {summary.split(/\n\n+/).filter(Boolean).map((para, i) => (
                  <p key={i} className="text-base sm:text-[17px] text-foreground font-serif leading-relaxed">
                    {para.trim()}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-border mb-10" />

        {/* ─── FULL ARTICLE LINK CARD ─── */}
        <div className="mb-12">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">
            Continue reading
          </p>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 p-5 border border-border hover:border-[#e59c6a]/60 bg-muted/30 hover:bg-[#e59c6a]/5 transition-all duration-300"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#e59c6a] uppercase tracking-widest">{article.source}</span>
              </div>
              <p className="text-sm font-bold text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-[#e59c6a] transition-colors tracking-tight">
                {article.title}
              </p>
              <p className="text-xs text-muted-foreground font-serif">Read full article →</p>
            </div>
            <div className="flex-shrink-0 pt-1">
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#e59c6a] transition-colors" />
            </div>
          </a>
        </div>

        <div className="border-t border-border mb-10" />

        {/* ─── MORE STORIES FOR YOU ─── */}
        {relatedArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">More Stories For You</h2>
              <Link
                href="/"
                className="flex items-center gap-1 text-xs font-bold text-[#e59c6a] uppercase tracking-widest hover:underline"
              >
                All Stories <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {relatedArticles.map((related) => (
                <RelatedArticleCard key={related.id} article={related} />
              ))}
            </div>
          </section>
        )}
      </article>

      <footer className="w-full border-t border-border bg-muted/30 py-8 mt-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} OnyeAkụkọ
          </p>
          <a
            href="https://x.com/OnyeAkuko"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground hover:text-[#e59c6a] transition-colors"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.961h-1.91z"></path></g>
            </svg>
            Follow on X
          </a>
        </div>
      </footer>
    </div>
  )
}

function RelatedArticleCard({ article }: { article: Article }) {
  const [imgError, setImgError] = useState(false)
  const slug = slugify(article.title)

  return (
    <Link
      href={`/article/${encodeURIComponent(slug)}`}
      className="group flex items-start gap-4 py-5 hover:bg-muted/20 transition-colors -mx-2 px-2"
    >
      <div className="flex-shrink-0 w-20 h-16 sm:w-24 bg-muted overflow-hidden border border-border">
        <img
          src={(!article.imageUrl || article.imageUrl === "N/A" || imgError) ? "/Group728.png" : article.imageUrl}
          alt={article.title}
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${(!article.imageUrl || article.imageUrl === "N/A" || imgError) ? "opacity-40 grayscale object-contain p-3" : ""}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold text-[#e59c6a] uppercase tracking-[0.2em]">{article.source}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{article.category}</span>
        </div>
        <h3 className="text-sm sm:text-base font-black text-foreground leading-snug tracking-tight group-hover:text-[#e59c6a] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 font-serif line-clamp-1 leading-relaxed">
          {article.description}
        </p>
      </div>
    </Link>
  )
}
