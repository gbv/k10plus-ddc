#!/usr/bin/env node
import fs from "fs"
import { program } from "commander"
import readline from "readline"
import { Analyzer } from "./lib/analyzer.js"

program
  .name("analyze")
  .description("Analyze DDC notations with coli-ana API")
  .option("-i, --input <file>", "input file (default: - for STDIN)")
  .option("-o, --output <file>", "output file (default: - for STDOUT)")
  .option("-c, --continue <ddc>", "continue after given DDC notation (expect sorted)")
  .option("-a, --api <URL>", "coli-ana API endpoint")
  .option("-d, --database <file>", "optional SQLite file for caching")
  .action(action)

await program.parseAsync(process.argv)

async function action(opt, args) {
  const input = (opt.input ?? "-") == "-" ? process.stdin : fs.createReadStream(opt.input)
  const output = (opt.output ?? "-") == "-" ? process.stdin : fs.createReadStream(opt.output)

  const analyzer = new Analyzer(opt)

  let analyzedCount = 0, failedCount = 0
  const startTime = new Date()

  readline.createInterface({ input, terminal: false })
    .on("line", async ddc => {
      ddc = ddc.split(/\s/)[0]
      if (opt.continue && ddc.localeCompare(opt.continue) < 0) return
      const result = await analyzer.analyze(ddc)
      console.log(JSON.stringify(result))
    })
}
