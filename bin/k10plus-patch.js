#!/usr/bin/env node

import fs from "fs"
import { program } from "commander"
import { Patcher } from "../lib/patcher.js"
import { Transform, Readable } from "stream"
import { parseStream, serializePica, getPPN } from "pica-data"
import split2 from "split2"
import axios from "axios"

program
  .name('k10plus-patch')
  .description('Check and extend DDC numbers in PICA records of K10plus catalogue')
  .option('-a, --api <URL>', 'coli-ana API endpoint')
  .option('-c, --continue <ppn>', 'continue after given PPN (expect sorted)')
  .option('-f, --format <name>', 'PICA+ serialization (default: plain)')
  .option('-i, --input <file>', 'input file (default: - for STDIN)')
  .option('-d, --database <file>', 'optional SQLite file for caching')
  .option('-p, --ppns', 'input is list of PPNs instead of PICA records')
  .action(action)

await program.parseAsync(process.argv)

async function action(opts) {
  const ppnValue = ppn => (parseInt((ppn || "").slice(0,-1)) || 0)

  const startPPN = ppnValue(opts.continue)
  const input = (opts.input || '-') == "-" ? process.stdin : fs.createReadStream(opts.input)
  const format = opts.format || "plain"

  const patcher = new Patcher(opts)
  const patchTransform = new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform: (record, encoding, next) => {
      if (ppnValue(getPPN(record)) > startPPN) {
        patcher.patchRecord(record).then(result => next(null, result))
      } else {
        next(null)
      }
    }
  })

  var recordStream

  if (opts.ppns) {
    recordStream = input.pipe(split2("\n")).pipe(new Transform({
      readableObjectMode: true,
      transform: (ppn, encoding, next) => {
        if (`${ppn}`.match(/^[0-9]+[0-9Xx]$/)) {
          const id = `opac-de-627!xpn=online!levels=0:ppn:${ppn}`
          axios.get("https://unapi.k10plus.de/", { params: { id, format: "picajson" } })
          .catch(() => console.error(`unAPI request failed with PPN ${ppn}`))
          .then(result => next(null, result?.data || []))
        } else {
          next(null, [])
        }
      }
    })) 
  } else {
    recordStream = parseStream(input, { format })
  }

  recordStream.pipe(patchTransform)
  .on("error", ({message, line}) => console.error(`${message} on line ${line}`))
  .on("data", patch => {
    if (patch.length) {
      console.log(serializePica(patch, { format: 'annotated' }))
    }
  })
}
