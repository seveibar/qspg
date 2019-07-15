#!/usr/bin/env node

const [, , ...args] = process.argv

if (args.length !== 1) {
  console.log(`USAGE: qspg update path/to/migrations`)
  process.exit(1)
}

const migrationsDir = args[0]
const fs = require("fs")
const path = require("path")
const qspg = require("../")

qspg
  .default({
    migrationsDir: path.resolve(migrationsDir)
  })
  .then(async conn => {
    await conn.destroy()
  })
