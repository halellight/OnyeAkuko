"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react"

interface Match {
  id: string
  stage: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: "FT" | "LIVE" | "Upcoming"
  time: string
  logoType: "fifa" | "npfl" | "epl"
}

export function SportsScores() {
  const [activeTab, setActiveTab] = useState<"worldcup" | "npfl" | "epl">("worldcup")
  const [matchData, setMatchData] = useState<Record<"worldcup" | "npfl" | "epl", Match[]>>({
    worldcup: [],
    npfl: [],
    epl: []
  })
  const [matchIndex, setMatchIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [mouseDownX, setMouseDownX] = useState<number | null>(null)

  // Fetch match scores from the backend API
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/sports-scores")
        if (response.ok) {
          const data = await response.json()
          setMatchData(data)
        }
      } catch (error) {
        console.error("Failed to fetch sports scores:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScores()

    // Refresh scores every 60 seconds for live updates
    const interval = setInterval(fetchScores, 60000)
    return () => clearInterval(interval)
  }, [])

  // Reset slider index when tab changes
  useEffect(() => {
    setMatchIndex(0)
  }, [activeTab])

  // Custom SVG Flags and Crests Mapper
  const getTeamLogo = (name: string, type: "fifa" | "npfl" | "epl") => {
    const normalized = name.trim().toLowerCase()

    if (type === "fifa") {
      switch (normalized) {
        case "france":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="1" height="2" fill="#002395" />
              <rect x="1" width="1" height="2" fill="#FFFFFF" />
              <rect x="2" width="1" height="2" fill="#ED2939" />
            </svg>
          )
        case "senegal":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="1" height="2" fill="#00853F" />
              <rect x="1" width="1" height="2" fill="#FDEF42" />
              <rect x="2" width="1" height="2" fill="#E31B23" />
              <polygon points="1.5,0.8 1.55,0.95 1.7,0.95 1.58,1.05 1.62,1.2 1.5,1.1 1.38,1.2 1.42,1.05 1.3,0.95 1.45,0.95" fill="#00853F" />
            </svg>
          )
        case "iraq":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="0.67" fill="#C8102E" />
              <rect y="0.67" width="3" height="0.67" fill="#FFFFFF" />
              <rect y="1.34" width="3" height="0.66" fill="#000000" />
              <circle cx="1.3" cy="1" r="0.06" fill="#007A3D" />
              <circle cx="1.7" cy="1" r="0.06" fill="#007A3D" />
            </svg>
          )
        case "norway":
          return (
            <svg viewBox="0 0 22 16" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="22" height="16" fill="#BA0C2F" />
              <rect x="6" width="4" height="16" fill="#FFFFFF" />
              <rect y="6" width="22" height="4" fill="#FFFFFF" />
              <rect x="7" width="2" height="16" fill="#00205B" />
              <rect y="7" width="22" height="2" fill="#00205B" />
            </svg>
          )
        case "argentina":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="0.67" fill="#74ACDF" />
              <rect y="0.67" width="3" height="0.67" fill="#FFFFFF" />
              <rect y="1.34" width="3" height="0.66" fill="#74ACDF" />
              <circle cx="1.5" cy="1" r="0.12" fill="#F9A812" stroke="#8A5A2B" strokeWidth="0.01" />
            </svg>
          )
        case "algeria":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="1.5" height="2" fill="#006233" />
              <rect x="1.5" width="1.5" height="2" fill="#FFFFFF" />
              <circle cx="1.5" cy="1" r="0.25" fill="#D21034" />
              <circle cx="1.6" cy="1" r="0.22" fill="#FFFFFF" />
              <polygon points="1.65,0.9 1.67,0.97 1.75,0.97 1.69,1.02 1.71,1.1 1.65,1.05 1.59,1.1 1.61,1.02 1.55,0.97 1.63,0.97" fill="#D21034" />
            </svg>
          )
        case "austria":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#C8102E" />
              <rect y="0.67" width="3" height="0.66" fill="#FFFFFF" />
            </svg>
          )
        case "jordan":
          return (
            <svg viewBox="0 0 2 1" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="2" height="0.33" fill="#000000" />
              <rect y="0.33" width="2" height="0.33" fill="#FFFFFF" />
              <rect y="0.66" width="2" height="0.34" fill="#1A7A40" />
              <polygon points="0,0 0.5,0.5 0,1" fill="#E01E37" />
              <circle cx="0.18" cy="0.5" r="0.04" fill="#FFFFFF" />
            </svg>
          )
        case "england":
          return (
            <svg viewBox="0 0 5 3" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0 bg-white">
              <rect x="2.1" width="0.8" height="3" fill="#CE1126" />
              <rect y="1.1" width="5" height="0.8" fill="#CE1126" />
            </svg>
          )
        case "croatia":
          return (
            <svg viewBox="0 0 2 1" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="2" height="0.33" fill="#FF0000" />
              <rect y="0.33" width="2" height="0.33" fill="#FFFFFF" />
              <rect y="0.66" width="2" height="0.34" fill="#0000C8" />
              <rect x="0.9" y="0.25" width="0.2" height="0.22" fill="#FF0000" stroke="#FFFFFF" strokeWidth="0.02" />
            </svg>
          )
        case "portugal":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="1.2" height="2" fill="#006600" />
              <rect x="1.2" width="1.8" height="2" fill="#FF0000" />
              <circle cx="1.2" cy="1" r="0.2" fill="#FFFF00" />
            </svg>
          )
        case "colombia":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="1" fill="#FCD116" />
              <rect y="1" width="3" height="0.5" fill="#003893" />
              <rect y="1.5" width="3" height="0.5" fill="#CE1126" />
            </svg>
          )
        case "panama":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0 bg-white">
              <rect x="1.5" width="1.5" height="1" fill="#D21034" />
              <rect y="1" width="1.5" height="1" fill="#002F6C" />
              <polygon points="0.75,0.2 0.77,0.35 0.9,0.35 0.8,0.45 0.83,0.6 0.75,0.5 0.67,0.6 0.7,0.45 0.6,0.35 0.73,0.35" fill="#002F6C" />
              <polygon points="2.25,1.2 2.27,1.35 2.4,1.35 2.3,1.45 2.33,1.6 2.25,1.5 2.17,1.6 2.2,1.45 2.1,1.35 2.23,1.35" fill="#D21034" />
            </svg>
          )
        case "congo dr":
          return (
            <svg viewBox="0 0 4 3" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="4" height="3" fill="#007FFF" />
              <polygon points="0,3 4,0 4,0.4 0.5,3" fill="#FDD017" />
              <polygon points="0,3 4,0 3.7,0 0,2.8" fill="#FDD017" />
              <polygon points="0,3 4,0.2 4,0.1 0.1,3" fill="#D21034" />
              <polygon points="0.6,0.3 0.63,0.45 0.75,0.45 0.65,0.55 0.68,0.7 0.6,0.6 0.52,0.7 0.55,0.55 0.45,0.45 0.57,0.45" fill="#FDD017" />
            </svg>
          )
        case "uzbekistan":
          return (
            <svg viewBox="0 0 2 1" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="2" height="0.3" fill="#00C5FF" />
              <rect y="0.3" width="2" height="0.05" fill="#E31B23" />
              <rect y="0.35" width="2" height="0.3" fill="#FFFFFF" />
              <rect y="0.65" width="2" height="0.05" fill="#E31B23" />
              <rect y="0.7" width="2" height="0.3" fill="#1EB53A" />
              <circle cx="0.25" cy="0.45" r="0.08" fill="#FFFFFF" />
              <circle cx="0.29" cy="0.45" r="0.08" fill="#00C5FF" />
            </svg>
          )
        case "mexico":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="1" height="2" fill="#006847" />
              <rect x="1" width="1" height="2" fill="#FFFFFF" />
              <rect x="2" width="1" height="2" fill="#C8102E" />
              <circle cx="1.5" cy="1" r="0.12" fill="#d4af37" />
              <circle cx="1.5" cy="1" r="0.06" fill="#8b5a2b" />
            </svg>
          )
        case "south africa":
          return (
            <svg viewBox="0 0 6 4" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="6" height="2" fill="#E21C1C" />
              <rect y="2" width="6" height="2" fill="#0006B1" />
              <path d="M 0,0 L 2.4,1.6 L 6,1.6 L 6,2.4 L 2.4,2.4 L 0,4 Z" fill="#007C3C" stroke="white" strokeWidth="0.4" strokeLinejoin="round" />
              <path d="M 0,0 L 2.0,2.0 L 0,4 Z" fill="#000000" stroke="#FFB81C" strokeWidth="0.3" strokeLinejoin="round" />
            </svg>
          )
        case "nigeria":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="1" height="2" fill="#008751" />
              <rect x="1" width="1" height="2" fill="#FFFFFF" />
              <rect x="2" width="1" height="2" fill="#008751" />
            </svg>
          )
        case "ivory coast":
        case "côte d'ivoire":
        case "cote d'ivoire":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="1" height="2" fill="#FF8200" />
              <rect x="1" width="1" height="2" fill="#FFFFFF" />
              <rect x="2" width="1" height="2" fill="#009A44" />
            </svg>
          )
        case "ghana":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#FFB81C" />
              <rect width="3" height="0.67" fill="#E21C1C" />
              <rect y="1.33" width="3" height="0.67" fill="#006B3F" />
              <polygon points="1.5,0.7 1.6,1.0 1.9,1.0 1.7,1.2 1.8,1.5 1.5,1.3 1.2,1.5 1.3,1.2 1.1,1.0 1.4,1.0" fill="#000" />
            </svg>
          )
        case "uruguay":
          return (
            <svg viewBox="0 0 9 6" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="9" height="6" fill="#FFFFFF" />
              <rect y="0.67" width="9" height="0.67" fill="#3A89C9" />
              <rect y="2" width="9" height="0.67" fill="#3A89C9" />
              <rect y="3.33" width="9" height="0.67" fill="#3A89C9" />
              <rect y="4.67" width="9" height="0.67" fill="#3A89C9" />
              <circle cx="1.5" cy="1.5" r="0.8" fill="#FFD700" stroke="#000" strokeWidth="0.1" />
            </svg>
          )
        case "spain":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#AD1519" />
              <rect y="0.5" width="3" height="1" fill="#FABD00" />
              <circle cx="0.8" cy="1" r="0.18" fill="#AD1519" />
            </svg>
          )
        case "cabo verde":
        case "cape verde":
          return (
            <svg viewBox="0 0 5 3" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="5" height="3" fill="#002F6C" />
              <rect y="1.5" width="5" height="0.6" fill="#FFFFFF" />
              <rect y="1.7" width="5" height="0.2" fill="#C8102E" />
              <circle cx="1.8" cy="1.8" r="0.4" stroke="#FFD700" strokeWidth="0.1" strokeDasharray="0.1,0.1" fill="none" />
            </svg>
          )
        case "belgium":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="1" height="2" fill="#000000" />
              <rect x="1" width="1" height="2" fill="#FFE319" />
              <rect x="2" width="1" height="2" fill="#E30A17" />
            </svg>
          )
        case "egypt":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#C8102E" />
              <rect y="0.67" width="3" height="0.67" fill="#FFFFFF" />
              <rect y="1.34" width="3" height="0.66" fill="#000000" />
              <circle cx="1.5" cy="1" r="0.1" fill="#C09300" />
            </svg>
          )
        case "saudi arabia":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#006C35" />
              <line x1="0.6" y1="1.3" x2="2.4" y2="1.3" stroke="white" strokeWidth="0.15" />
            </svg>
          )
        case "iran":
        case "ir iran":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="0.67" fill="#239F40" />
              <rect y="0.67" width="3" height="0.67" fill="#FFFFFF" />
              <rect y="1.34" width="3" height="0.66" fill="#DA251D" />
              <circle cx="1.5" cy="1" r="0.1" fill="#DA251D" />
            </svg>
          )
        case "new zealand":
          return (
            <svg viewBox="0 0 2 1" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="2" height="1" fill="#00247D" />
              <rect x="0" y="0" width="0.8" height="0.5" fill="#00247D" stroke="white" strokeWidth="0.08" />
              <line x1="0" y1="0" x2="0.8" y2="0.5" stroke="#C8102E" strokeWidth="0.05" />
              <line x1="0.8" y1="0" x2="0" y2="0.5" stroke="#C8102E" strokeWidth="0.05" />
              <circle cx="1.5" cy="0.3" r="0.03" fill="#C8102E" stroke="white" strokeWidth="0.01" />
              <circle cx="1.3" cy="0.5" r="0.03" fill="#C8102E" stroke="white" strokeWidth="0.01" />
              <circle cx="1.7" cy="0.6" r="0.03" fill="#C8102E" stroke="white" strokeWidth="0.01" />
            </svg>
          )
        case "united states":
        case "usa":
          return (
            <svg viewBox="0 0 19 10" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="19" height="10" fill="#B22234" />
              <rect y="0.77" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="1.54" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="2.31" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="3.08" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="3.85" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="4.62" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="5.39" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="6.16" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="6.93" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="7.7" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="8.47" width="19" height="0.77" fill="#FFFFFF" />
              <rect y="9.24" width="19" height="0.77" fill="#FFFFFF" />
              <rect width="7.6" height="5.38" fill="#3C3B6E" />
              <circle cx="2" cy="1.5" r="0.2" fill="white" />
              <circle cx="4" cy="1.5" r="0.2" fill="white" />
              <circle cx="6" cy="1.5" r="0.2" fill="white" />
            </svg>
          )
        case "canada":
          return (
            <svg viewBox="0 0 2 1" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="2" height="1" fill="#FF0000" />
              <rect x="0.5" width="1" height="1" fill="#FFFFFF" />
              <polygon points="1,0.2 1.1,0.5 0.9,0.5" fill="#FF0000" />
              <polygon points="0.85,0.4 1.15,0.4 1,0.7" fill="#FF0000" />
              <rect x="0.97" y="0.6" width="0.06" height="0.2" fill="#FF0000" />
            </svg>
          )
        case "korea republic":
        case "south korea":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0 bg-white">
              <circle cx="1.5" cy="1" r="0.4" fill="#CD2E3A" />
              <path d="M1.5 1 A 0.2 0.2 0 0 0 1.5 1.4 A 0.2 0.2 0 0 0 1.5 0.6 Z" fill="#0047A0" />
              <rect x="0.4" y="0.4" width="0.2" height="0.05" fill="black" transform="rotate(30 0.4 0.4)" />
              <rect x="2.4" y="0.4" width="0.2" height="0.05" fill="black" transform="rotate(-30 2.4 0.4)" />
            </svg>
          )
        case "czechia":
        case "czech republic":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#D7141A" />
              <rect width="3" height="1" fill="#FFFFFF" />
              <polygon points="0,0 1.5,1 0,2" fill="#11457E" />
            </svg>
          )
        case "bosnia and herzegovina":
          return (
            <svg viewBox="0 0 2 1" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="2" height="1" fill="#002F6C" />
              <polygon points="0.4,0 1.4,0 0.4,1" fill="#FFD700" />
              <circle cx="0.5" cy="0.2" r="0.02" fill="white" />
              <circle cx="0.6" cy="0.4" r="0.02" fill="white" />
              <circle cx="0.7" cy="0.6" r="0.02" fill="white" />
              <circle cx="0.8" cy="0.8" r="0.02" fill="white" />
            </svg>
          )
        case "paraguay":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#0038A8" />
              <rect width="3" height="1.33" fill="#FFFFFF" />
              <rect width="3" height="0.67" fill="#D52B1E" />
              <circle cx="1.5" cy="1" r="0.1" fill="#FFD700" />
            </svg>
          )
        case "haiti":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#D21034" />
              <rect width="3" height="1" fill="#00209F" />
              <rect x="1.3" y="0.8" width="0.4" height="0.4" fill="#FFFFFF" />
              <circle cx="1.5" cy="1" r="0.08" fill="#007A33" />
            </svg>
          )
        case "scotland":
          return (
            <svg viewBox="0 0 5 3" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="5" height="3" fill="#005EB8" />
              <line x1="0" y1="0" x2="5" y2="3" stroke="white" strokeWidth="0.5" />
              <line x1="5" y1="0" x2="0" y2="3" stroke="white" strokeWidth="0.5" />
            </svg>
          )
        case "australia":
          return (
            <svg viewBox="0 0 2 1" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="2" height="1" fill="#00008B" />
              {/* Simplistic Union Jack outline */}
              <rect width="0.8" height="0.5" fill="#00008B" stroke="white" strokeWidth="0.08" />
              <line x1="0" y1="0" x2="0.8" y2="0.5" stroke="#Red" strokeWidth="0.04" />
              <line x1="0.8" y1="0" x2="0" y2="0.5" stroke="#Red" strokeWidth="0.04" />
              {/* Star */}
              <polygon points="1.4,0.5 1.45,0.65 1.6,0.65 1.48,0.75 1.52,0.9 1.4,0.8 1.28,0.9 1.32,0.75 1.2,0.65 1.35,0.65" fill="white" />
            </svg>
          )
        case "turkiye":
        case "turkey":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#E30A17" />
              <circle cx="1.2" cy="1" r="0.35" fill="white" />
              <circle cx="1.3" cy="1" r="0.28" fill="#E30A17" />
              <polygon points="1.7,1 1.8,1.08 1.77,1.2 1.88,1.12 1.98,1.2 1.92,1.08 2.02,1 1.9,1 1.88,0.88 1.8,1" fill="white" />
            </svg>
          )
        case "brazil":
          return (
            <svg viewBox="0 0 220 154" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="220" height="154" fill="#009739" />
              <polygon points="110,12 204,77 110,142 16,77" fill="#FEDD00" />
              <circle cx="110" cy="77" r="37" fill="#00185F" />
              <path d="M 73,77 A 37,37 0 0 0 147,77" fill="none" stroke="white" strokeWidth="2.5" />
            </svg>
          )
        case "morocco":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#C1272D" />
              <polygon points="1.5,0.6 1.55,0.8 1.75,0.8 1.58,0.92 1.64,1.12 1.5,1 1.36,1.12 1.42,0.92 1.25,0.8 1.45,0.8" fill="none" stroke="#006233" strokeWidth="0.06" />
            </svg>
          )
        case "qatar":
          return (
            <svg viewBox="0 0 22 11" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="22" height="11" fill="#8A1538" />
              <rect width="6" height="11" fill="#FFFFFF" />
              <polygon points="6,0 7,0.55 6,1.1 7,1.65 6,2.2 7,2.75 6,3.3 7,3.85 6,4.4 7,4.95 6,5.5 7,6.05 6,6.6 7,7.15 6,7.7 7,8.25 6,8.8 7,9.35 6,9.9 7,10.45 6,11" fill="#FFFFFF" />
            </svg>
          )
        case "switzerland":
          return (
            <svg viewBox="0 0 1 1" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0 bg-[#DA291C] p-0.5">
              <rect x="0.4" y="0.15" width="0.2" height="0.7" fill="#FFFFFF" />
              <rect x="0.15" y="0.4" width="0.7" height="0.2" fill="#FFFFFF" />
            </svg>
          )
        case "ecuador":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="1" fill="#FFDD00" />
              <rect y="1" width="3" height="0.5" fill="#0035A6" />
              <rect y="1.5" width="3" height="0.5" fill="#D21034" />
              <circle cx="1.5" cy="1" r="0.12" fill="#FFDD00" stroke="#8B5A2B" strokeWidth="0.02" />
            </svg>
          )
        case "germany":
          return (
            <svg viewBox="0 0 5 3" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="5" height="1" fill="#000000" />
              <rect y="1" width="5" height="1" fill="#DD0000" />
              <rect y="2" width="5" height="1" fill="#FFCC00" />
            </svg>
          )
        case "curacao":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#002B7F" />
              <rect y="1.33" width="3" height="0.33" fill="#F9E814" />
              <circle cx="0.4" cy="0.4" r="0.1" fill="white" />
              <circle cx="0.7" cy="0.6" r="0.06" fill="white" />
            </svg>
          )
        case "netherlands":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="0.67" fill="#AE1C28" />
              <rect y="0.67" width="3" height="0.67" fill="#FFFFFF" />
              <rect y="1.34" width="3" height="0.66" fill="#21468B" />
            </svg>
          )
        case "japan":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0 bg-white">
              <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
            </svg>
          )
        case "sweden":
          return (
            <svg viewBox="0 0 16 10" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="16" height="10" fill="#006AA7" />
              <rect x="5" width="2" height="10" fill="#FECC00" />
              <rect y="4" width="16" height="2" fill="#FECC00" />
            </svg>
          )
        case "tunisia":
          return (
            <svg viewBox="0 0 3 2" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0">
              <rect width="3" height="2" fill="#E20E17" />
              <circle cx="1.5" cy="1" r="0.4" fill="white" />
              <circle cx="1.5" cy="1" r="0.3" fill="none" stroke="#E20E17" strokeWidth="0.08" />
              <polygon points="1.5,0.85 1.55,1.02 1.7,1.02 1.58,1.1 1.62,1.25 1.5,1.15 1.38,1.25 1.42,1.1 1.3,1.02 1.45,1.02" fill="#E20E17" />
            </svg>
          )
        default:
          // Fallback globe logo
          return (
            <svg viewBox="0 0 20 20" className="w-7 h-4.5 shadow-sm border border-white/20 rounded-sm flex-shrink-0 bg-slate-700 p-0.5" fill="none" stroke="white" strokeWidth="1.2">
              <circle cx="10" cy="10" r="8" stroke="white" />
              <path d="M10 2v16M2 10h16M4 6c3 2 3 6 0 8M16 6c-3 2-3 6 0 8" opacity="0.7" />
            </svg>
          )
      }
    }

    // Shield Mapper for club teams
    let primary = "#94a3b8"
    let secondary = "#ffffff"
    let letter = name.charAt(0).toUpperCase()

    if (type === "npfl") {
      if (normalized.includes("rangers")) {
        primary = "#E21C1C"
        letter = "R"
      } else if (normalized.includes("enyimba")) {
        primary = "#0006B1"
        letter = "E"
      } else if (normalized.includes("pillars")) {
        primary = "#FFB81C"
        secondary = "#0006B1"
        letter = "K"
      } else if (normalized.includes("remo")) {
        primary = "#007C3C"
        letter = "R"
      }
    } else if (type === "epl") {
      if (normalized.includes("arsenal")) {
        primary = "#EF4444"
        letter = "A"
      } else if (normalized.includes("chelsea")) {
        primary = "#2563EB"
        letter = "C"
      } else if (normalized.includes("united")) {
        primary = "#DC2626"
        secondary = "#FBBF24"
        letter = "M"
      } else if (normalized.includes("liverpool")) {
        primary = "#B91C1C"
        secondary = "#FBBF24"
        letter = "L"
      }
    }

    return (
      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 relative">
        <svg viewBox="0 0 20 20" className="w-5.5 h-5.5 drop-shadow-sm">
          <path d="M10 2 C 15 2, 18 5, 18 10 C 18 16, 13 19, 10 20 C 7 19, 2 16, 2 10 C 2 5, 5 2, 10 2 Z" fill={primary} stroke={secondary} strokeWidth="1.5" />
          <text x="10" y="14.5" fill={secondary} fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">{letter}</text>
        </svg>
      </div>
    )
  }

  const activeMatches = matchData[activeTab] || []
  const currentMatch = activeMatches[matchIndex]

  const nextMatch = () => {
    if (activeMatches.length > 0) {
      setMatchIndex((prev) => (prev + 1) % activeMatches.length)
    }
  }

  const prevMatch = () => {
    if (activeMatches.length > 0) {
      setMatchIndex((prev) => (prev - 1 + activeMatches.length) % activeMatches.length)
    }
  }

  // Touch Swipe Handlers for Mobile Swipe Action
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    // Swipe left (next match)
    if (diff > 50) {
      nextMatch()
    }
    // Swipe right (prev match)
    else if (diff < -50) {
      prevMatch()
    }
    setTouchStartX(null)
  }

  // Mouse Drag Swipe Handlers for Desktop Drag Action
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDownX(e.clientX)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseDownX === null) return
    const mouseEndX = e.clientX
    const diff = mouseDownX - mouseEndX
    // Swipe left (next match)
    if (diff > 50) {
      nextMatch()
    }
    // Swipe right (prev match)
    else if (diff < -50) {
      prevMatch()
    }
    setMouseDownX(null)
  }

  const handleMouseLeave = () => {
    setMouseDownX(null)
  }

  // Render Header Logo Badge
  const renderLogo = (type: "fifa" | "npfl" | "epl") => {
    if (type === "fifa") {
      return (
        <img
          src="/fifa-2026-logo.png"
          alt="FIFA World Cup 2026"
          className="h-11 w-auto object-contain flex-shrink-0 select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
      )
    }

    if (type === "npfl") {
      return (
        <div className="flex items-center gap-1.5 bg-black/35 px-2.5 py-1 border border-white/10 rounded-sm">
          <Trophy className="w-3.5 h-3.5 text-[#e5c158]" />
          <span className="text-[9px] font-black text-white uppercase tracking-wider">NPFL</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1.5 bg-black/35 px-2.5 py-1 border border-white/10 rounded-sm">
        <Trophy className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-[9px] font-black text-white uppercase tracking-wider">EPL</span>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col mb-4 sports-scores-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .sports-scores-container svg {
          border: none !important;
        }
      `}} />

      {/* Loading Skeleton */}
      {loading || !currentMatch ? (
        <div className="relative w-full h-[180px] bg-muted animate-pulse rounded-[20px] border border-border flex items-center justify-center">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">LOADING SCORES...</span>
        </div>
      ) : (
        /* Main Pitch Card with User's custom background */
        <div
          className="relative w-full h-[180px] bg-[#1b802e] bg-cover bg-center shadow-xl overflow-hidden rounded-[20px] border border-white/10 group/card select-none cursor-grab active:cursor-grabbing"
          style={{ backgroundImage: "url('/soccer-pitch-bg.png')" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Content Overlay */}
          <div className="absolute inset-0 p-5 flex flex-col justify-between z-10 bg-black/10">
            {/* Header Row */}
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-1">
                {renderLogo(currentMatch.logoType)}
                <span className="text-[11px] font-black text-white/80 tracking-wider uppercase mt-1 drop-shadow-sm">
                  {currentMatch.stage}
                </span>
              </div>

              {/* Time / Live State Badge */}
              <div className="flex items-center gap-2">
                {currentMatch.status === "LIVE" ? (
                  <div className="flex items-center gap-1.5 bg-red-600/90 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 animate-pulse rounded-[2px] shadow-sm">
                    <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-ping" />
                    <span>LIVE {currentMatch.time}</span>
                  </div>
                ) : (
                  <div className="bg-black/35 text-white/90 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-[2px] shadow-sm">
                    {currentMatch.time || "TBD"}
                  </div>
                )}
              </div>
            </div>

            {/* Teams Table */}
            <div className="flex flex-col gap-2 my-auto">
              {/* Team 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTeamLogo(currentMatch.homeTeam, currentMatch.logoType)}
                  <span className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase font-display leading-none drop-shadow-md">
                    {currentMatch.homeTeam}
                  </span>
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-display leading-none mr-2 drop-shadow-md">
                  {currentMatch.status === "Upcoming" ? "-" : currentMatch.homeScore}
                </span>
              </div>

              {/* Team 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTeamLogo(currentMatch.awayTeam, currentMatch.logoType)}
                  <span className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase font-display leading-none drop-shadow-md">
                    {currentMatch.awayTeam}
                  </span>
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-display leading-none mr-2 drop-shadow-md">
                  {currentMatch.status === "Upcoming" ? "-" : currentMatch.awayScore}
                </span>
              </div>
            </div>

            {/* Dots Indicator & Navigation Indicators */}
            {activeMatches.length > 1 && (
              <div className="flex items-center justify-between w-full border-t border-white/10 pt-2 text-white/70 text-[10px] uppercase font-bold tracking-widest">
                <div className="flex gap-1">
                  {activeMatches.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMatchIndex(idx)}
                      className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                        idx === matchIndex ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Slider Arrows */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMatch}
                    className="p-1 hover:bg-white/10 active:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer rounded-full"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={nextMatch}
                    className="p-1 hover:bg-white/10 active:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer rounded-full"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
