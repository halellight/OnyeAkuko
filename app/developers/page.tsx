"use client"

import { useState } from "react"
import Link from "next/link"
import { NewsHeader } from "@/components/news-header"
import { NewsFooter } from "@/components/news-footer"
import { Copy, Check, Terminal, Code2, Globe, ShieldCheck, ExternalLink, Sparkles } from "lucide-react"

export default function DevelopersPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"js" | "react" | "curl" | "python" | "iframe">("js")
  const [testEndpoint, setTestEndpoint] = useState("/api/news?topic=election&limit=5")
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const runApiTest = async () => {
    setTesting(true)
    try {
      const res = await fetch(testEndpoint)
      const data = await res.json()
      setTestResult(JSON.stringify(data, null, 2))
    } catch (err: any) {
      setTestResult(JSON.stringify({ error: err.message }, null, 2))
    } finally {
      setTesting(false)
    }
  }

  const codeSnippets = {
    js: `// Fetch 2027 Election Updates from OnyeAkụkọ
async function getElectionNews() {
  const response = await fetch("https://onyeakuko.online/api/news?topic=election&limit=5", {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });

  const news = await response.json();
  console.log("Live Election News:", news);
  return news;
}`,
    react: `import { useState, useEffect } from "react";

export function ElectionNewsWidget() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://onyeakuko.online/api/news?topic=election&limit=5")
      .then((res) => res.json())
      .then((data) => {
        setNews(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load OnyeAkuko news:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading 2027 election updates...</div>;

  return (
    <div className="election-widget">
      <h3>2027 Election Updates</h3>
      <p className="text-xs">Powered by OnyeAkụkọ</p>
      <ul>
        {news.map((item) => (
          <li key={item.id}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <strong>{item.title}</strong>
            </a>
            <p>{item.source} • {item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    curl: `# Fetch election news directly via cURL
curl -X GET "https://onyeakuko.online/api/news?topic=election&limit=5" \\
  -H "Accept: application/json"

# Or use the versioned public API
curl -X GET "https://onyeakuko.online/api/v1/news?topic=election&limit=5" \\
  -H "Accept: application/json"`,
    python: `import requests

# Fetch latest election updates from OnyeAkuko
url = "https://onyeakuko.online/api/v1/news"
params = {
    "topic": "election",
    "limit": 5
}

response = requests.get(url, params=params)
data = response.json()

for story in data.get("data", []):
    print(f"[{story.get('source')}] {story.get('title')}")
    print(f"Link: {story.get('link')}\\n")`,
    iframe: `<!-- Drop-in responsive 2027 Election Updates Card -->
<iframe
  src="https://onyeakuko.online/embed/election"
  width="100%"
  height="460"
  style="border: 1px solid #e2e8f0; border-radius: 1rem; overflow: hidden;"
  title="OnyeAkuko 2027 Election Updates"
  loading="lazy"
></iframe>`
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <NewsHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Title & Introduction */}
        <div className="mb-10 text-center sm:text-left border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Public API & Partner Integrations</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground">
            OnyeAkụkọ News API
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Integrate live Nigerian and African news, election updates, and Ground News-style media bias distribution into your website, dashboard, or civic tool.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-5 border border-border rounded-xl bg-card">
            <Globe className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Open CORS Enabled</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Call our endpoints directly from client-side browser JavaScript, React widgets, or backend microservices without CORS blocks.
            </p>
          </div>
          <div className="p-5 border border-border rounded-xl bg-card">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-3" />
            <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Multi-Perspective Clustered</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every story groups reporting across independent, state, and private media to combat echo chambers and fake news.
            </p>
          </div>
          <div className="p-5 border border-border rounded-xl bg-card">
            <Code2 className="w-6 h-6 text-orange-500 mb-3" />
            <h3 className="font-bold text-sm uppercase tracking-wider mb-1">2027 Election Focused</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dedicated filtering for voter education, INEC updates, candidates, polling logistics, and electoral reforms.
            </p>
          </div>
        </div>

        {/* Endpoints Reference */}
        <div className="mb-12">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-4">Available Endpoints</h2>
          <div className="space-y-4">
            {/* Endpoint 1 */}
            <div className="p-4 border border-border rounded-xl bg-muted/20">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-2 py-0.5 rounded">GET</span>
                  <code className="text-sm font-semibold">/api/news</code>
                </div>
                <span className="text-xs text-muted-foreground">Main JSON Feed (Array format)</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Returns clustered news stories. Supports topic filtering (e.g. <code>topic=election</code>), keyword search (<code>q=...</code>), categories, and limit.
              </p>
            </div>

            {/* Endpoint 2 */}
            <div className="p-4 border border-border rounded-xl bg-muted/20">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-2 py-0.5 rounded">GET</span>
                  <code className="text-sm font-semibold">/api/v1/news</code>
                </div>
                <span className="text-xs text-muted-foreground">Versioned Public API (Object format)</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Standardized REST format with status, metadata, and attribution object. Pass <code>wrap=false</code> for raw array.
              </p>
            </div>

            {/* Endpoint 3 */}
            <div className="p-4 border border-border rounded-xl bg-muted/20">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-2 py-0.5 rounded">GET</span>
                  <code className="text-sm font-semibold">/api/news/election</code>
                </div>
                <span className="text-xs text-muted-foreground">Dedicated 2027 Election Feed</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Pre-filtered specifically for voter and electoral updates. Ideal for platforms like Nivo.
              </p>
            </div>

            {/* Endpoint 4 */}
            <div className="p-4 border border-border rounded-xl bg-muted/20">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-2 py-0.5 rounded">EMBED</span>
                  <code className="text-sm font-semibold">/embed/election</code>
                </div>
                <span className="text-xs text-muted-foreground">Drop-in HTML Widget</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Pre-styled, ready-to-embed interactive widget. Drop into any web page with an iframe.
              </p>
            </div>
          </div>
        </div>

        {/* Parameters Table */}
        <div className="mb-12">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-4">Query Parameters</h2>
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Default</th>
                  <th className="p-3">Description / Examples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 font-mono font-semibold">topic</td>
                  <td className="p-3 text-muted-foreground">string</td>
                  <td className="p-3 font-mono">none</td>
                  <td className="p-3">Filter by curated topic, e.g. <code>election</code>, <code>politics</code></td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold">q / search</td>
                  <td className="p-3 text-muted-foreground">string</td>
                  <td className="p-3 font-mono">none</td>
                  <td className="p-3">Keyword search against headlines and article summaries</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold">limit</td>
                  <td className="p-3 text-muted-foreground">number</td>
                  <td className="p-3 font-mono">20</td>
                  <td className="p-3">Number of stories to return (1 - 100)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold">category</td>
                  <td className="p-3 text-muted-foreground">string</td>
                  <td className="p-3 font-mono">all</td>
                  <td className="p-3"><code>politics</code>, <code>technology</code>, <code>culture</code>, <code>world</code></td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold">region</td>
                  <td className="p-3 text-muted-foreground">string</td>
                  <td className="p-3 font-mono">all</td>
                  <td className="p-3"><code>nigeria</code>, <code>africa</code>, <code>global</code></td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold">format</td>
                  <td className="p-3 text-muted-foreground">string</td>
                  <td className="p-3 font-mono">stories</td>
                  <td className="p-3"><code>stories</code> (clustered) or <code>flat</code> (individual articles)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Snippets Section */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wide">Implementation Examples</h2>
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border text-xs">
              {(["js", "react", "curl", "python", "iframe"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "js" ? "JavaScript" : tab === "react" ? "React" : tab === "curl" ? "cURL" : tab === "python" ? "Python" : "Embed (iframe)"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl border border-border bg-muted/20 p-4 font-mono text-xs overflow-x-auto">
            <button
              onClick={() => copyToClipboard(codeSnippets[activeTab], activeTab)}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-background/80 hover:bg-background border border-border text-xs font-sans transition-all"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <pre className="text-foreground leading-relaxed">{codeSnippets[activeTab]}</pre>
          </div>
        </div>

        {/* Interactive API Tester */}
        <div className="mb-12 border border-border rounded-xl p-5 bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Interactive Live Tester</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Test endpoint queries directly right now and inspect the real JSON response.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={testEndpoint}
              onChange={(e) => setTestEndpoint(e.target.value)}
              className="flex-1 px-3 py-2 text-xs font-mono bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="/api/news?topic=election&limit=5"
            />
            <button
              onClick={runApiTest}
              disabled={testing}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {testing ? "Testing..." : "Send Request"}
            </button>
          </div>

          {testResult && (
            <div className="mt-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Response:</div>
              <pre className="max-h-80 overflow-y-auto p-3 bg-muted/40 rounded-lg text-[11px] font-mono leading-relaxed border border-border">
                {testResult}
              </pre>
            </div>
          )}
        </div>

        {/* Attribution Guidelines */}
        <div className="p-5 border border-border rounded-xl bg-muted/10 mb-8">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Attribution Guidelines</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            When displaying news from OnyeAkụkọ on external websites or apps (such as Nivo), please include visible attribution:
            <span className="block mt-1 font-semibold text-foreground">
              "Powered by OnyeAkụkọ" linking back to <a href="https://onyeakuko.online" target="_blank" rel="noopener noreferrer" className="underline">https://onyeakuko.online</a>
            </span>
          </p>
        </div>
      </main>

      <NewsFooter />
    </div>
  )
}
