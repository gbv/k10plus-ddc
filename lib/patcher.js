import { getPPN, PicaPath, serializePica } from "pica-data"
import { Analyzer } from "./analyzer.js"
import { picaFromDDC } from "./pica.js"

const ddcPath = new PicaPath('045F$a')
const ddcURL = new PicaPath('045F$u')
const ddcNotation = new RegExp('^[0-9]{3}[\'/]?\.[0-9\'/]+$')

export class Patcher {
  constructor(options) {
    this.api = new Analyzer({ api: options.api, database: options.database })
  }

  async patchRecord(record) {
    const ppn = getPPN(record)

    return Promise.all(ddcPath.getFields(record).map(async p045F => {
      const ddcs = ddcPath.getValues([p045F]).filter(ddc => ddcNotation.test(ddc))
      if (ddcs.length !== 1) return []

      const notation = ddcs[0].replaceAll(/[\/']/g,'')
      const concept = await this.api.analyze(notation)

      const patch = []
      const field045H = picaFromDDC(concept)
      if (field045H) { // only true if complete analysis exists

        const [url] = ddcURL.getValues([p045F])
        if (url) {
            // TODO: check whether URL is valid?
        } else {
          patch.push([...p045F, '-'])
          patch.push([...p045F, 'u',`https://www.gbv.de/dms/ddc/${concept.notation}.pdf`, '+']) 
        }
                 
        // TODO: only if record does not include yet!
        patch.push([...field045H, "+"])
      } else {
        console.warn(`missing or incomplete analysis: ${notation}`)
        // TODO: remove wrong analysis?
      }

      return patch
    })).then(patches => {
      const patch = patches.flat()
      if (patch.length && ppn) {
        patch.unshift(['003@','','0',ppn])
      }
      return patch
    })
  }
}

