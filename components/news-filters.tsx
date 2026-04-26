"use client"

interface NewsFiltersProps {
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  selectedRegion: string
  setSelectedRegion: (value: string) => void
  selectedSentiment: string
  setSelectedSentiment: (value: string) => void
  timeRange: string
  setTimeRange: (value: string) => void
}

export function NewsFilters({
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  selectedSentiment,
  setSelectedSentiment,
  timeRange,
  setTimeRange,
}: NewsFiltersProps) {
  // Region, Sentiment, and Time Range filters hidden for now
  // Uncomment the block below to re-enable them

  /*
  const REGIONS = [
    { id: "all", label: "All Regions" },
    { id: "global", label: "Global" },
    { id: "africa", label: "Africa" },
    { id: "nigeria", label: "Nigeria" },
  ]

  const SENTIMENTS = [
    { id: "all", label: "All Sentiments" },
    { id: "positive", label: "Positive" },
    { id: "neutral", label: "Neutral" },
    { id: "negative", label: "Negative" },
  ]

  const TIME_RANGES = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
  ]

  return (
    <div className="mb-10 sm:mb-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 border-b border-border pb-6">
        <div className="relative group">
          <h4 className="text-[10px] font-bold text-[#e59c6a] uppercase tracking-[0.2em] mb-2 pl-1">Region</h4>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-1 py-2 bg-transparent border-b-2 border-border text-foreground text-lg font-bold focus:outline-none focus:border-[#e59c6a] appearance-none rounded-none cursor-pointer transition-colors"
          >
            {REGIONS.map((region) => (
              <option key={region.id} value={region.id}>{region.label}</option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <h4 className="text-[10px] font-bold text-[#e59c6a] uppercase tracking-[0.2em] mb-2 pl-1">Sentiment</h4>
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="w-full px-1 py-2 bg-transparent border-b-2 border-border text-foreground text-lg font-bold focus:outline-none focus:border-[#e59c6a] appearance-none rounded-none cursor-pointer transition-colors"
          >
            {SENTIMENTS.map((sentiment) => (
              <option key={sentiment.id} value={sentiment.id}>{sentiment.label}</option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <h4 className="text-[10px] font-bold text-[#e59c6a] uppercase tracking-[0.2em] mb-2 pl-1">Time Range</h4>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-1 py-2 bg-transparent border-b-2 border-border text-foreground text-lg font-bold focus:outline-none focus:border-[#e59c6a] appearance-none rounded-none cursor-pointer transition-colors"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.id} value={range.id}>{range.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
  */

  // Filters hidden — return nothing
  return null
}
