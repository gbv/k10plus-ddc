import axios from "axios"
import Database from "better-sqlite3"

export class Analyzer {
  constructor({api, database}={}) {    
    this.api = api || "https://coli-conc.gbv.de/coli-ana/app/analyze"
    if (database) {
      this.db = new Database(database)
      this.db.exec("CREATE TABLE IF NOT EXISTS coliana (notation TEXT NOT NULL, analysis TEXT)")
      this.db.pragma("journal_mode = WAL")
      this.insert = this.db.prepare("INSERT INTO coliana (notation, analysis) VALUES (?,?)")
      this.lookup = this.db.prepare("SELECT analysis FROM coliana WHERE notation=?")
    }
  }

  async analyze(notation) {
    if (this.lookup) {
      const row = this.lookup.get(notation)
      if (row) {
        return JSON.parse(row.analysis)
      }
    }
    const { insert } = this
    return axios.get(this.api, { params: { notation } })
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
        if (insert) {
          insert.run(notation, JSON.stringify(concept))
        }
        return concept
      })
  }
}
