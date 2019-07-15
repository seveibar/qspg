#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const qspg = require("./")

const [, , ...args] = process.argv

if (args.length === 0) {
  console.log(`Must specify "qspg (compile|update|migrate|init)"`)
  process.exit(1)
}

if (args[0] === "migrate" || args[0] === "update") {
  if (args.length !== 2) {
    console.log("Must specify migrationsDir")
    process.exit(1)
  }

  qspg
    .default({
      migrationsDir: path.resolve(args[1])
    })
    .then(async conn => {
      await conn.destroy()
      process.exit(1)
    })
} else if (args[0] === "compile") {
  if (args.length !== 2 && args.length !== 3) {
    console.log(`USAGE: qspg compile path/to/migrations [dest_file.sql]`)
    process.exit(1)
  }
  const migrationsDir = args[1]

  qspg.compile(path.resolve(migrationsDir)).then(sql => {
    if (args.length === 3) {
      fs.writeFileSync(path.resolve(args[2]), sql)
    } else {
      console.log(sql)
    }
  })
} else if (args[0] === "init") {
  console.log("qspg init isn't ready yet")
}
