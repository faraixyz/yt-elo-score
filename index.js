require('dotenv').config()
const {readFileSync, writeFileSync} = require("fs")
const {google} = require("googleapis")
const {parse} = require("csv-parse/sync")

const yt = google.youtube({
    version: 'v3',
    auth: process.env.YT_API_KEY
})


async function main () {
    const subsFile = readFileSync("subscriptions.csv", {encoding: "utf-8"})
    const subs = parse(subsFile, {
        skipEmptyLines: true,
        from: 2
    }).map(x => x[0])
    const subsinfo = []

    for (let i=0; i < subs.length; i+=50) {
        const res = await yt.channels.list({
            part: "snippet,topicDetails",
            id: subs.slice(i, i+50).join(','),
            maxResults: 50, 
        })

        for (const sub of res.data.items) {
            const subdata = {
                title: sub.snippet.title,
                description: sub.snippet.description,
                id: sub.id
            }

            if (sub.snippet.thumbnails) {
                subdata.thumbnail = sub.snippet.thumbnails["default"]
            }

            if (sub.topicDetails) {
                subdata.topics = sub.topicDetails.topicCategories
            }

            subsinfo.push(subdata)
        }

    }
    console.log(subsinfo.length)
    writeFileSync("subinfo.json", JSON.stringify(subsinfo, null, 4))
}

main()
