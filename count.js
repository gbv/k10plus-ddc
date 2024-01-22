import anystream from "json-anystream"

// Parse arguments
const args = [...process.argv.slice(2)]
let number = undefined, format = "csv", arg
while (arg = args.shift()) {
  switch (arg) {
    case "--jskos":
      format = "jskos"
      break
    case "--cocoda":
      format = "cocoda"
      break
    case "-n":
      number = parseInt(args.shift())
      if (isNaN(number) || number <= 0) {
        console.error("-n requires a positive integer")
        process.exit(1)
      }
      break
    default:
      console.warn("Unknown argument:", arg)
  }
}

const result = {}

const stream = await anystream.make("./result.ndjson")
for await (let concept of stream) {
  for (const member of concept?.memberList || []) {
    const uri = member?.uri
    if (uri) {
      if (!result[uri]) {
        result[uri] = {
          uri,
          _count: 0,
          notation: member.notation,
        }
      }
      result[uri]._count += 1
    }
  }
}

const resultSorted = Object.keys(result).sort((a, b) => result[b]._count - result[a]._count).filter(uri => !uri.startsWith("http://dewey.info/facet/")).slice(0, number)

resultSorted.forEach(uri => {
  if (format === "csv") {
    console.log(`${uri},${result[uri]._count}`)
  } else if (format === "jskos") {
    console.log(JSON.stringify({
      ...result[uri],
      inScheme: [{ uri: "http://bartoc.org/en/node/241" }],
      type: ["http://www.w3.org/2004/02/skos/core#Concept"],
    }))
  }
})

if (format === "cocoda") {
  console.log(JSON.stringify({
    prefLabel: {
      de: "DDC-Notationsbestandteile im K10plus",
    },
    schemes: [{
      uri: "http://bartoc.org/en/node/241",
    }],
    concepts: resultSorted.map(uri => result[uri]),
  }, null, 2))
}
