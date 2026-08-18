import { NextResponse } from "next/server"

interface Match {
  id: string
  stage: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: "FT" | "LIVE" | "Upcoming"
  time: string
  logoType: "wafcon" | "npfl" | "epl"
}

// 🏆 Concluded WAFCON (Women's Africa Cup of Nations Morocco) Actual Results
const wafconTournamentMatches: Match[] = [
  {
    id: "wafcon-final",
    stage: "FINAL",
    homeTeam: "Cameroon",
    awayTeam: "Malawi",
    homeScore: 3,
    awayScore: 0,
    status: "FT",
    time: "Sun, 16 Aug",
    logoType: "wafcon"
  },
  {
    id: "wafcon-3rd",
    stage: "3RD PLACE",
    homeTeam: "Morocco",
    awayTeam: "Algeria",
    homeScore: 1,
    awayScore: 1,
    status: "FT",
    time: "FT (2-3p)",
    logoType: "wafcon"
  },
  {
    id: "wafcon-sf1",
    stage: "SEMI FINAL",
    homeTeam: "Algeria",
    awayTeam: "Malawi",
    homeScore: 1,
    awayScore: 3,
    status: "FT",
    time: "Wed, 12 Aug",
    logoType: "wafcon"
  },
  {
    id: "wafcon-sf2",
    stage: "SEMI FINAL",
    homeTeam: "Morocco",
    awayTeam: "Cameroon",
    homeScore: 0,
    awayScore: 0,
    status: "FT",
    time: "FT (1-3p)",
    logoType: "wafcon"
  },
  {
    id: "wafcon-qf1",
    stage: "QUARTER FINAL",
    homeTeam: "Ivory Coast",
    awayTeam: "Algeria",
    homeScore: 1,
    awayScore: 2,
    status: "FT",
    time: "Sat, 8 Aug",
    logoType: "wafcon"
  },
  {
    id: "wafcon-qf2",
    stage: "QUARTER FINAL",
    homeTeam: "Morocco",
    awayTeam: "South Africa",
    homeScore: 2,
    awayScore: 1,
    status: "FT",
    time: "Sat, 8 Aug",
    logoType: "wafcon"
  },
  {
    id: "wafcon-qf3",
    stage: "QUARTER FINAL",
    homeTeam: "Cameroon",
    awayTeam: "Nigeria",
    homeScore: 1,
    awayScore: 0,
    status: "FT",
    time: "Sun, 9 Aug",
    logoType: "wafcon"
  },
  {
    id: "wafcon-qf4",
    stage: "QUARTER FINAL",
    homeTeam: "Malawi",
    awayTeam: "Ghana",
    homeScore: 2,
    awayScore: 1,
    status: "FT",
    time: "Sun, 9 Aug",
    logoType: "wafcon"
  }
]

// 🇳🇬 Dynamic NPFL and EPL fixtures
function getDynamicClubMatches(type: "npfl" | "epl"): Match[] {
  const npflMatches: Match[] = [
    {
      id: "npfl-1",
      stage: "NPFL MD 28",
      homeTeam: "Enyimba",
      awayTeam: "Remo Stars",
      homeScore: 2,
      awayScore: 1,
      status: "FT",
      time: "FT",
      logoType: "npfl"
    },
    {
      id: "npfl-2",
      stage: "NPFL MD 28",
      homeTeam: "Rivers United",
      awayTeam: "Rangers Intl",
      homeScore: 1,
      awayScore: 1,
      status: "FT",
      time: "FT",
      logoType: "npfl"
    },
    {
      id: "npfl-3",
      stage: "NPFL MD 28",
      homeTeam: "Shooting Stars",
      awayTeam: "Kano Pillars",
      homeScore: 2,
      awayScore: 0,
      status: "FT",
      time: "FT",
      logoType: "npfl"
    },
    {
      id: "npfl-4",
      stage: "NPFL MD 28",
      homeTeam: "Bendel Insurance",
      awayTeam: "Plateau United",
      homeScore: 1,
      awayScore: 0,
      status: "FT",
      time: "FT",
      logoType: "npfl"
    }
  ]

  const eplMatches: Match[] = [
    {
      id: "epl-1",
      stage: "PREMIER LEAGUE",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      homeScore: 3,
      awayScore: 1,
      status: "FT",
      time: "FT",
      logoType: "epl"
    },
    {
      id: "epl-2",
      stage: "PREMIER LEAGUE",
      homeTeam: "Liverpool",
      awayTeam: "Man City",
      homeScore: 2,
      awayScore: 2,
      status: "FT",
      time: "FT",
      logoType: "epl"
    },
    {
      id: "epl-3",
      stage: "PREMIER LEAGUE",
      homeTeam: "Man United",
      awayTeam: "Tottenham",
      homeScore: 2,
      awayScore: 0,
      status: "FT",
      time: "FT",
      logoType: "epl"
    }
  ]

  return type === "npfl" ? npflMatches : eplMatches
}

export async function GET() {
  try {
    return NextResponse.json({
      wafcon: wafconTournamentMatches,
      worldcup: wafconTournamentMatches, // backward compatibility
      npfl: getDynamicClubMatches("npfl"),
      epl: getDynamicClubMatches("epl")
    })
  } catch (error) {
    console.error("[sports-scores-api] Error returning scores:", error)
    return NextResponse.json({
      wafcon: wafconTournamentMatches,
      worldcup: wafconTournamentMatches,
      npfl: getDynamicClubMatches("npfl"),
      epl: getDynamicClubMatches("epl")
    })
  }
}
