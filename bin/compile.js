#!/usr/bin/env node

const [, , ...args] = process.argv

if (args.length > 2 || args.length === 0) {
  console.log(`USAGE: qspg compile path/to/migrations [dest_file.sql]`)
  process.exit(1)
}

const migrationsDir = args[0]
const fs = require("fs")
const path = require("path")
const qspg = require("../")

qspg.compile(path.resolve(migrationsDir)).then(sql => {
  if (args.length === 2) {
    fs.writeFileSync(path.resolve(args[1]), sql)
  } else {
    console.log(sql)
  }
})
