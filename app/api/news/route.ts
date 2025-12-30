import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json([{
    id: "test",
    title: "Production Test",
    description: "If you see this, basic GET works.",
    date: new Date().toISOString(),
    source: "System",
    category: "world",
    sentiment: "neutral",
    region: "global",
    imageUrl: "/nigerian-tech-startup.jpg",
    link: "#",
    credibility: 1.0
  }])
}
