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
  return (
    <div className="mb-10 sm:mb-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 border-b border-[#222] pb-6">
        <div className="relative group">
          <h4 className="text-[10px] font-bold text-[#e59c6a] uppercase tracking-[0.2em] mb-2 pl-1">Region</h4>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-1 py-2 bg-transparent border-b-2 border-[#333] text-white text-lg font-bold focus:outline-none focus:border-[#e59c6a] appearance-none rounded-none cursor-pointer transition-colors group-hover:border-[#555]"
          >
            {REGIONS.map((region) => (
              <option key={region.id} value={region.id} className="bg-[#111] text-white">
                {region.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <h4 className="text-[10px] font-bold text-[#e59c6a] uppercase tracking-[0.2em] mb-2 pl-1">Sentiment</h4>
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="w-full px-1 py-2 bg-transparent border-b-2 border-[#333] text-white text-lg font-bold focus:outline-none focus:border-[#e59c6a] appearance-none rounded-none cursor-pointer transition-colors group-hover:border-[#555]"
          >
            {SENTIMENTS.map((sentiment) => (
              <option key={sentiment.id} value={sentiment.id} className="bg-[#111] text-white">
                {sentiment.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <h4 className="text-[10px] font-bold text-[#e59c6a] uppercase tracking-[0.2em] mb-2 pl-1">Time Range</h4>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-1 py-2 bg-transparent border-b-2 border-[#333] text-white text-lg font-bold focus:outline-none focus:border-[#e59c6a] appearance-none rounded-none cursor-pointer transition-colors group-hover:border-[#555]"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.id} value={range.id} className="bg-[#111] text-white">
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
