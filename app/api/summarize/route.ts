import { type NextRequest, NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_URL = "https://api.openai.com/v1/chat/completions"

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()

    if (!title) {
      return NextResponse.json({ summary: description, isAI: false })
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ summary: description, isAI: false })
    }

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `You are a senior news editor at OnyeAkụkọ, a Nigerian digital news platform. Your job is to rewrite news stories into clear, digestible summaries for everyday African readers.

Write the summary in 3 short paragraphs:
1. **What happened** — Lead with the most important fact. One or two direct sentences.
2. **The details** — Expand on the key people, numbers, context, or events. Two to three sentences.
3. **Why it matters** — Explain the real-world impact or significance for Nigerians/Africans. One or two sentences.

Rules:
- Write in plain, conversational English — no jargon
- Do NOT use markdown formatting, bullet points, or headers in your output
- Separate each paragraph with a blank line
- Be factual, balanced, and grounded — never speculative
- Keep the total length between 120 and 180 words`
          },
          {
            role: "user",
            content: `Article Title: ${title}\nArticle Description: ${description}`
          }
        ],
        max_tokens: 350,
        temperature: 0.5,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error("[summarize] OpenAI API error:", errText)
      return NextResponse.json({ summary: description, isAI: false })
    }

    const data = await response.json()
    const summary = data?.choices?.[0]?.message?.content?.trim()

    if (!summary) {
      return NextResponse.json({ summary: description, isAI: false })
    }

    return NextResponse.json({ summary, isAI: true })
  } catch (error) {
    console.error("[summarize] Error:", error)
    return NextResponse.json({ summary: "", isAI: false })
  }
}
