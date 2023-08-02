import axios from "axios"
import fs from "fs"

// Parse arguments
const args = [...process.argv.slice(2)]
let override = false, continueFromNotation = null, file = "result.ndjson", api = "https://coli-conc.gbv.de/coli-ana/dev/analyze", input = "./ddcs", arg
while (arg = args.shift()) {
  switch (arg) {
    case "-o":
      override = true
      break
    case "-c":
      continueFromNotation = args.shift()
      break
    case "-f":
      file = args.shift()
      if (!file) {
        console.error("-f needs an argument")
        process.exit(1)
      }
      break
    case "--api":
      api = args.shift()
      if (!api) {
        console.error("--api needs an argument")
        process.exit(1)
      }
      break
    case "--input":
      input = args.shift()
      if (!input) {
        console.error("--input needs an argument")
        process.exit(1)
      }
    default:
      console.warn("Unknown argument:", arg)
  }
}

const resultStream = fs.createWriteStream(file, { flags: override ? "w" : "a" })
let ddcs = fs.readFileSync(input, "utf-8").split("\n")

if (continueFromNotation) {
  const index = ddcs.findIndex(ddc => ddc.startsWith(`${continueFromNotation} \t`))
  if (index === -1) {
    console.error(`Notation ${continueFromNotation} not found in ${input}, exiting...`)
    process.exit(1)
  }
  ddcs = ddcs.slice(index)
}
console.log(`Analyzing ${ddcs.length - 1} notations from ${input}`, continueFromNotation ? `, starting at ${continueFromNotation}` : "")

let analyzedCount = 0, failedCount = 0
const startTime = new Date()

while (ddcs.length > 0) {
  // Do multiple notations in parallel -> yes, coli-ana API only works on one at a time, but we're saving a little bit of time still
  const notations = [ddcs.shift(), ddcs.shift(), ddcs.shift(), ddcs.shift(), ddcs.shift(), ddcs.shift(), ddcs.shift(), ddcs.shift(), ddcs.shift(), ddcs.shift()].filter(Boolean).map(ddc => ddc.split(" \t")[0])
  const promises = notations.map(notation =>
    axios.get(api, { params: { notation } })
      .catch(() => {
        console.error("API request failed:", notation)
        return null
      })
      .then(result => {
        if (!result) {
          result = {}
        }
        result._notation = notation
        return result
      })
  )
  const results = await Promise.all(promises)
  results.forEach(result => {
    const analyzed = result.data?.[0]?.memberList?.length > 1
    if (analyzed) {
      analyzedCount += 1
      resultStream.write(JSON.stringify(result.data[0]) + "\n")
    } else {
      failedCount += 1
      // Write concept with empty memberList to result file
      resultStream.write(`{"uri":"http://dewey.info/class/${result._notation}/e23/","notation":["${result._notation}"],"inScheme":[{"uri":"http://dewey.info/scheme/edition/e23/"}],"memberList":[null]}\n`)
    }
    if ((analyzedCount + failedCount) % 1000 === 0) {
      console.log(`${analyzedCount} analyzed (${failedCount} failed) in ${(new Date() - startTime) / 1000} seconds.`)
    }
  })
}

resultStream.end()
