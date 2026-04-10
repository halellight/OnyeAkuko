import { loadEnvConfig } from "@next/env"
loadEnvConfig(process.cwd())

import { scrapeNigerianNews } from "./lib/news-scraper"
import { processDigestSending } from "./lib/notifications"

const easterAddress = `Happy Easter to you and yours from all of us at OnyeAkuko!

Today is a profound reminder of hope, renewal, and faith. As we navigate the complex news cycles and rapidly shifting global events, it’s important to pause and reflect on the core message of this season: Jesus is the reason for the season; He has risen! 

May this Easter Sunday bring you joy, peace, and clarity. Below is your evening brief of the most critical updates across Nigeria.

Stay informed, stay blessed.`;

async function runEasterBlast() {
    console.log("Starting Easter blast script...")
    const articles = await scrapeNigerianNews()
    console.log(`Found ${articles.length} articles from scraper.`)

    if (articles.length === 0) {
        console.error("No articles found to send. Aborting.")
        return;
    }

    console.log("Sending special Easter address email blast to all Evening subscribers...")

    // We will let processDigestSending fetch the Evening subscribers naturally 
    // by not supplying the subscribers field.
    const result = await processDigestSending({
        articles,
        digestTime: "Evening",
        editorialNote: easterAddress
    })

    console.log("Blast result:", result)
}

runEasterBlast().catch(console.error)
