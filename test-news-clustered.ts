import { getNews } from "./lib/news.ts"

async function run() {
    console.log("Fetching clustered news stories via getNews()...")
    const stories = await getNews({ timeRange: "today" })
    console.log(`\nSuccessfully fetched ${stories.length} stories!`)
    if (stories.length > 0) {
        console.log("Top 5 Stories:")
        stories.slice(0, 5).forEach((story, idx) => {
            console.log(`\n[Story #${idx+1}] TITLE: "${story.title}"`)
            console.log(`    Date: ${story.date}`)
            console.log(`    Category: ${story.category} | Region: ${story.region} | Sentiment: ${story.sentiment}`)
            console.log(`    Coverage Count: ${story.coverageCount} source(s)`)
            console.log(`    Bias Distribution:`, story.biasDistribution)
            console.log(`    Sources involved:`, story.articles.map((a: any) => `${a.source} (${a.bias})`))
            console.log(`    Main Image: ${story.imageUrl}`)
        })
    }
}

run()
