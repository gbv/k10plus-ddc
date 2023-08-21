import axios from "axios"

export class Analyzer {
  constructor({api,atomic}={}) {    
    this.api = api || "https://coli-conc.gbv.de/coli-ana/app/analyze"
    this.atomic = atomic
  }

  async analyze(notation, options={}) {
    // TODO: add caching 
    return axios.get(this.api, { params: { notation, atomic: this.atomic } })
      .catch(() => {
        console.error(`request failed: ${this.api}?notation=${notation}`)
        return null
      })
      .then(result => result.data?.[0] || {})
      .then(concept => {
        if (!concept.notation?.[0]) {
          concept.notation = [notation]
        }
        if (!concept.memberList?.length > 1) {
          concept.memberList = [null]
        }
        return concept
      })
    }
}
