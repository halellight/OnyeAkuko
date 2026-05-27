"use client"

import { useState, useEffect } from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { Sparkles, BarChart3, HelpCircle, ShieldAlert, Award } from "lucide-react"

interface ClickLog {
  source: string
  bias: "government-aligned" | "opposition-leaning" | "independent" | "neutral"
  timestamp: number
}

const BIAS_INFO = {
  "government-aligned": { label: "Govt-Aligned", color: "#ef4444", desc: "Outlets typically owned or aligned with state interests." },
  "opposition-leaning": { label: "Opposition", color: "#3b82f6", desc: "Outlets leaning towards alternative/challenger parties." },
  "independent": { label: "Independent", color: "#10b981", desc: "Investigative or startup news platforms operating independently." },
  "neutral": { label: "Mainstream", color: "#94a3b8", desc: "General coverage outlets that aggregate or report neutrally." },
}

export function NewsDietAnalyzer() {
  const [mounted, setMounted] = useState(false)
  const [history, setHistory] = useState<ClickLog[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const loadStats = () => {
    try {
      const stored = localStorage.getItem("onyeakuko_diet_clicks")
      if (stored) {
        setHistory(JSON.parse(stored))
      } else {
        setHistory([])
      }
    } catch (e) {
      console.warn("Could not read localStorage", e)
    }
  }

  useEffect(() => {
    setMounted(true)
    loadStats()

    // Listen for read click events dispatched from cards
    window.addEventListener("onyeakuko_diet_updated", loadStats)
    return () => {
      window.removeEventListener("onyeakuko_diet_updated", loadStats)
    }
  }, [])

  if (!mounted) return null

  // Process data
  const totalClicks = history.length
  
  const counts = history.reduce(
    (acc, curr) => {
      const b = curr.bias || "neutral"
      acc[b] = (acc[b] || 0) + 1
      return acc
    },
    { "government-aligned": 0, "opposition-leaning": 0, "independent": 0, "neutral": 0 }
  )

  const chartData = [
    { name: "Govt-Aligned", value: counts["government-aligned"], color: "#ef4444" },
    { name: "Opposition", value: counts["opposition-leaning"], color: "#3b82f6" },
    { name: "Independent", value: counts["independent"], color: "#10b981" },
    { name: "Mainstream", value: counts["neutral"], color: "#94a3b8" },
  ].filter(d => d.value > 0)

  // Determine media literacy advice
  let adviceTitle = "Start Reading!"
  let adviceDesc = "Click on news cards in OnyeAkụkọ to analyze your reading diet pattern and reveal potential media blind spots."
  let adviceIcon = <HelpCircle className="h-5 w-5 text-[#e59c6a]" />

  if (totalClicks > 0) {
    const gov = counts["government-aligned"]
    const opp = counts["opposition-leaning"]
    const ind = counts["independent"]
    const neu = counts["neutral"]

    const maxVal = Math.max(gov, opp, ind, neu)

    if (gov === maxVal) {
      adviceTitle = "Government-Aligned Heavy"
      adviceDesc = "Your diet heavily mirrors official channels. Try reading Premium Times or Daily Trust to compare investigative reports and opposition viewpoints."
      adviceIcon = <ShieldAlert className="h-5 w-5 text-[#ef4444]" />
    } else if (opp === maxVal) {
      adviceTitle = "Opposition Leaning Heavy"
      adviceDesc = "Your diet is concentrated on opposition narratives. Consider checking ThisDay or official statements to inspect the state's direct policies."
      adviceIcon = <ShieldAlert className="h-5 w-5 text-[#3b82f6]" />
    } else if (ind === maxVal) {
      adviceTitle = "Independent Investigative Champion"
      adviceDesc = "Great job focusing on independent reporting! Ensure you check broad mainstream media occasionally to contrast general public consensus."
      adviceIcon = <Award className="h-5 w-5 text-[#10b981]" />
    } else {
      adviceTitle = "Mainstream Centered"
      adviceDesc = "You rely mainly on general news aggregators. Enriched your media literacy by diving deep into Premium Times or The Cable for investigative scoops."
      adviceIcon = <Sparkles className="h-5 w-5 text-[#94a3b8]" />
    }

    // Check for high diversity (balance)
    const activeBiasesCount = [gov, opp, ind, neu].filter(c => c > 0).length
    if (activeBiasesCount >= 3 && Math.abs(gov - opp) <= 3 && Math.abs(ind - neu) <= 3) {
      adviceTitle = "Diversified Reader Profile!"
      adviceDesc = "Excellent media literacy! You have a beautifully balanced news diet across multiple political spectrums. Keep up this critical reading habit."
      adviceIcon = <Award className="h-5 w-5 text-[#e59c6a]" />
    }
  }

  const handleReset = () => {
    if (confirm("Reset your News Diet history?")) {
      localStorage.removeItem("onyeakuko_diet_clicks")
      setHistory([])
      window.dispatchEvent(new Event("onyeakuko_diet_updated"))
    }
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="border border-border/80 bg-card rounded-sm overflow-hidden shadow-sm transition-all duration-300">
        
        {/* Header/Collapse Bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 flex items-center justify-between bg-muted/10 hover:bg-muted/30 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e59c6a]/10 text-[#e59c6a] rounded-sm">
              <BarChart3 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                Your News Diet Analyzer
              </h3>
              <p className="text-[11px] text-muted-foreground font-serif">
                {totalClicks === 0 
                  ? "Track coverage leans and political blind spots in your reading diet."
                  : `Analyzed ${totalClicks} read logs. Click to view media bias breakdown.`}
              </p>
            </div>
          </div>
          
          <span className="text-xs font-black uppercase tracking-widest text-[#e59c6a] hover:underline">
            {isOpen ? "Collapse Dashboard" : "Open Analyzer"}
          </span>
        </button>

        {/* Expandable Dashboard Content */}
        {isOpen && (
          <div className="p-6 border-t border-border/60 bg-card/50 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            {/* Chart Area */}
            <div className="flex flex-col items-center justify-center bg-muted/5 p-4 border border-border/40 min-h-[220px]">
              {totalClicks === 0 ? (
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full border border-dashed border-border mx-auto flex items-center justify-center mb-3">
                    <BarChart3 className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">No Clicks Logged yet</p>
                </div>
              ) : (
                <div className="w-full h-[180px] relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))", 
                          borderColor: "hsl(var(--border))",
                          fontSize: "11px",
                          fontFamily: "var(--font-sans)",
                          fontWeight: "bold",
                          textTransform: "uppercase"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Absolute Center Count */}
                  <div className="absolute text-center flex flex-col justify-center items-center pointer-events-none">
                    <span className="text-2xl font-black tracking-tight">{totalClicks}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground leading-[1]">Reads</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bias Distribution Percentages */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground pb-1 border-b border-border">
                Bias Representation
              </h4>
              
              {["government-aligned", "opposition-leaning", "independent", "neutral"].map((type) => {
                const info = BIAS_INFO[type as keyof typeof BIAS_INFO]
                const count = counts[type as keyof typeof counts] || 0
                const pct = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0
                
                return (
                  <div key={type} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                        {info.label}
                      </span>
                      <span className="text-muted-foreground">{pct}% ({count})</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%`, backgroundColor: info.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Media Literacy Recommendation Card */}
            <div className="flex flex-col justify-between h-full border border-[#e59c6a]/20 bg-[#e59c6a]/5 p-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {adviceIcon}
                  <h4 className="text-sm font-black uppercase tracking-wider text-foreground">
                    {adviceTitle}
                  </h4>
                </div>
                <p className="text-sm font-serif leading-relaxed text-muted-foreground">
                  {adviceDesc}
                </p>
              </div>

              {totalClicks > 0 && (
                <button
                  onClick={handleReset}
                  className="mt-5 text-[10px] font-black uppercase tracking-widest text-destructive hover:underline text-left self-start"
                >
                  Reset History
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
