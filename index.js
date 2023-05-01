require('dotenv').config()
const {google} = require("googleapis")
const csv = require("csv-parse")

const yt = google.youtube({
    version: 'v3',
    auth: process.env.YT_API_KEY
})

async function test () {
    const res = await yt.channels.list({
        part: 'topicDetails,snippet',
        id: ["UCyEA3vUnlpg0xzkECEq1rOA", "UC4a9LfdavRlVMaSSWFdIciA"]
    })

    console.log(res.data.items)
}

test()
