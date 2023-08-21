import anystream from "json-anystream"
import { parseStream, getPPN, PicaPath, serializePica } from "pica-data"
import { Analyzer } from "./lib/analyzer.js"
import { picaFromDDC } from "./lib/pica.js"
import { Transform } from "stream"

const ddcPath = new PicaPath('045F$a')
const ddcURL = new PicaPath('045F$u')
const ddcNotation = new RegExp('^[0-9]{3}[\'/]?\.[0-9\'/]+$')

const api = new Analyzer({ atomic: true })

const startPPN = 1000277 // TODO: pass by command line argument

parseStream(process.stdin, { format: "plain" })
  .pipe(new Transform({
    writableObjectMode: true,
    transform: (data, encoding, next) => processRecord(data).then(concept => next(null, concept))
  }))
  .on("error", ({message, line}) => console.error(`${message} on line ${line}`))

async function processRecord(record) {
  const ppn = getPPN(record)
  if (!ppn || parseInt(ppn.slice(0,-1)) < startPPN) return

  const ddcFields = ddcPath.getFields(record)
  if (!ddcFields.length) return

  return Promise.all(ddcFields.map(async field045F => {
    const ddcs = ddcPath.getValues([field045F]).filter(ddc => ddcNotation.test(ddc))
    if (ddcs.length !== 1) return []

    const notation = ddcs[0].replaceAll(/[\/']/g,'')
    const concept = await api.analyze(notation)

    const patch = []
    const field045H = picaFromDDC(concept)
    if (field045H) { // only true if complete analysis exists

      // TODO: check if u already there
      const [url] = ddcURL.getValues([field045F])
      if (url) {
          // TODO: check whether URL is valid
      } else {
        patch.push([...field045F, '-'])
        patch.push([...field045F, 'u',`https://www.gbv.de/dms/ddc/${concept.notation}.pdf`, '+']) 
      }
     
      // TODO: adjust occurrence /20?
      patch.push([...field045H, "+"])
    } else {
      console.warn(`missing or incomplete analysis: ${notation}`)
      // TODO: remove wrong analysis?
    }

    return patch
  })).then(patches => {
    const patch = patches.flat()
    if (patch.length) {
      patch.unshift(['003@','','0',ppn])
      console.log(serializePica(patch, { format: 'annotated' }))
    }
  })
}
