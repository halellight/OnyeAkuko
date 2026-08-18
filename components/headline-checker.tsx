"use client"

import { useState } from "react"
import { Search, ShieldCheck, AlertTriangle, CheckCircle2, Sparkles, RefreshCw, ArrowRight, Bot, ShieldAlert, CheckCircle, HelpCircle, ExternalLink } from "lucide-react"

interface SourceItem {
  title: string
  source: string
  link: string
  snippet?: string
}

interface FactCheckResult {
  verdict: string
  credibilityScore: number
  biasCategory: "government-aligned" | "opposition-leaning" | "independent" | "neutral"
  riskLevel: "low" | "medium" | "high"
  summary: string
  indicators: {
    domainTrust: string
    sensationalism: string
    aiRisk: string
    crossCheck: string
  }
  recommendations: string[]
  sources?: SourceItem[]
}

const SAMPLE_QUERIES = [
  "Is Muhammadu Buhari alive?",
  "CBN releases $500M to boost liquidity & stabilize Naira",
  "Breaking: Viral video claims massive fuel subsidy changes",
  "Did Nigeria grant tax exemptions for tech startups?"
]

export function HeadlineChecker() {
  const [query, setQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<FactCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeQuery = async (textToCheck: string) => {
    if (!textToCheck.trim()) return

    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/check-headline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline: textToCheck })
      })

      if (!response.ok) {
        throw new Error("Failed to process request with AI Engine")
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      console.error("[headline-checker] AI Request failed:", err)
      setError("AI Engine temporarily busy. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    analyzeQuery(query)
  }

  const handleSampleClick = (sample: string) => {
    setQuery(sample)
    analyzeQuery(sample)
  }

  const getVerdictStyle = (verdict: string, riskLevel: string) => {
    const upper = verdict.toUpperCase()
    if (upper.includes("TRUE") || upper.includes("VERIFIED")) {
      return {
        bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        icon: <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      }
    }
    if (upper.includes("FALSE") || upper.includes("DEBUNKED") || upper.includes("RUMOR")) {
      return {
        bg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
        icon: <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
      }
    }
    if (upper.includes("MISLEADING")) {
      return {
        bg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
        icon: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
      }
    }
    return {
      bg: "bg-sky-500/15 border-sky-500/30 text-sky-400",
      icon: <HelpCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
    }
  }

  return (
    <div className="w-full border border-border/80 bg-card rounded-2xl p-5 sm:p-7 shadow-sm transition-all">
      {/* Header Badge & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#e59c6a]/15 text-[#e59c6a] text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#e59c6a]/30 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-[#e59c6a]" /> AI Fact-Check Engine
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Live Media Verification
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-foreground">
            Instant Link & Claim Checker
          </h2>
        </div>
        <p className="text-xs text-muted-foreground max-w-xs font-medium">
          Ask real-time questions (e.g. "Is Buhari alive?") or paste news links to verify claims with AI.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-4 space-y-3">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything or paste headline (e.g. Is Buhari alive? or CBN policy change...)"
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none focus:border-[#e59c6a] focus:ring-1 focus:ring-[#e59c6a] transition-all placeholder:text-muted-foreground/60 text-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !query.trim()}
            className="px-6 py-3 rounded-xl bg-[#e59c6a] hover:bg-[#d48b59] text-black font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 flex-shrink-0 shadow-sm shadow-[#e59c6a]/20"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> AI Fact-Checking...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" /> Check Claim
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Sample Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5 text-xs">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">Quick Fact-Checks:</span>
        {SAMPLE_QUERIES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSampleClick(sample)}
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-muted/30 hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/40 transition-colors truncate max-w-[240px]"
            title={sample}
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-bold mb-4">
          {error}
        </div>
      )}

      {/* AI Analysis Output Results */}
      {result && (
        <div className="mt-5 pt-5 border-t border-border/60 space-y-5 animate-in fade-in duration-300">
          
          {/* AI Verdict Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border bg-background/50">
            <div className="flex items-center gap-3">
              {getVerdictStyle(result.verdict, result.riskLevel).icon}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">AI Fact-Check Verdict</span>
                <span className={`text-base font-black uppercase tracking-wider border px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${getVerdictStyle(result.verdict, result.riskLevel).bg}`}>
                  {result.verdict}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-border/50 pt-3 sm:pt-0 sm:pl-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Credibility Index</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black font-display ${
                    result.credibilityScore >= 70 ? "text-emerald-400" : result.credibilityScore >= 40 ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {result.credibilityScore}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">/100</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Bias Stance</span>
                <span className="text-xs font-black uppercase tracking-wider text-foreground">
                  {result.biasCategory.replace("-", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* AI Direct Explanation Summary */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e59c6a] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Ground-Truth Explanation
            </span>
            <p className="text-xs font-semibold text-foreground leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Detailed Verification Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Domain & Source Trust</span>
              <p className="text-xs font-semibold text-foreground">{result.indicators.domainTrust}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Sensationalism & Framing</span>
              <p className="text-xs font-semibold text-foreground">{result.indicators.sensationalism}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Synthetic Media & Deepfake Risk</span>
              <p className="text-xs font-semibold text-foreground">{result.indicators.aiRisk}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Cross-Verification Status</span>
              <p className="text-xs font-semibold text-foreground">{result.indicators.crossCheck}</p>
            </div>
          </div>

          {/* Verified News Sources & External Links */}
          {result.sources && result.sources.length > 0 && (
            <div className="p-4 rounded-xl border border-border/80 bg-background space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-[#e59c6a]" /> Verified News Sources & Citations
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {result.sources.length} CITATIONS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/60 hover:border-[#e59c6a]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#e59c6a] mb-1">
                        <span>{src.source}</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-[#e59c6a] transition-colors line-clamp-2">
                        {src.title}
                      </h4>
                      {src.snippet && (
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 font-medium">
                          {src.snippet}
                        </p>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground/80 group-hover:text-foreground uppercase tracking-widest mt-2 block">
                      Read Full Article ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations & Actionable Guidance */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="p-4 rounded-xl border border-[#e59c6a]/30 bg-[#e59c6a]/5 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#e59c6a] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Media Literacy Guidance
              </span>
              <ul className="space-y-1 text-xs text-foreground font-medium">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-[#e59c6a] flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
