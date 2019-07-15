const qspg = require("../../")
const path = require("path")
const test = require("ava")

test("should migrate and establish a connection", async t => {
  const migrationSQL = await qspg.compile(
    path.resolve(__dirname, "./migrations")
  )
  console.log(migrationSQL)
  t.pass("migration SQL compiled w/o error")
})

test("should migrate and establish a connection (postgres must be running)", async t => {
  const conn = await qspg.default({
    migrationsDir: path.resolve(__dirname, "./migrations"),
    testMode: true
  })

  await conn("test_people").insert({
    name: "james",
    phone_number: "123456789"
  })

  // await conn.destroy()

  t.pass("didn't error, migration successful")
})
