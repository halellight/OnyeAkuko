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

const CATEGORIES = [
  { id: "all", label: "All News" },
  { id: "world", label: "World News" },
  { id: "nigeria", label: "🇳🇬 Nigeria & Africa" },
  { id: "business", label: "Business & Economy" },
  { id: "technology", label: "Technology" },
  { id: "culture", label: "Culture & Lifestyle" },
  { id: "politics", label: "Politics" },
  { id: "science", label: "Science" },
]

const REGIONS = [
  { id: "all", label: "All Regions" },
  { id: "global", label: "Global" },
  { id: "africa", label: "Africa" },
  { id: "nigeria", label: "Nigeria" },
]

const SENTIMENTS = [
  { id: "all", label: "All Sentiments" },
  { id: "positive", label: "😊 Positive" },
  { id: "neutral", label: "😐 Neutral" },
  { id: "negative", label: "😔 Negative" },
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
    <div className="mb-8 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted border-2 text-foreground hover:border-[#ff9a88]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Region</h4>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {REGIONS.map((region) => (
              <option key={region.id} value={region.id}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Sentiment</h4>
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {SENTIMENTS.map((sentiment) => (
              <option key={sentiment.id} value={sentiment.id}>
                {sentiment.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Time Range</h4>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
