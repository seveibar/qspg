const qspg = require("../../")
const path = require("path")
const test = require("ava")

test("should migrate and establish a connection", async t => {
  const migrationSQL = await qspg.compile(
    path.resolve(__dirname, "./migrations")
  )
  t.snapshot(migrationSQL)
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

  await conn.destroy()

  t.pass("didn't error, migration successful")
})

test("should update versions and migrate only once despite subsequent connections", async t => {
  const conn = await qspg.default({
    migrationsDir: path.resolve(__dirname, "./migrations"),
    testMode: true
  })

  const { host, port, user, password, database } = conn.client.config.connection
  process.env.POSTGRES_HOST = host
  process.env.POSTGRES_PORT = port
  process.env.POSTGRES_USER = user
  process.env.POSTGRES_PASS = password
  process.env.POSTGRES_DB = database

  const conn2 = await qspg.default({
    migrationsDir: path.resolve(__dirname, "./migrations")
  })

  await conn.destroy()
  await conn2.destroy()

  t.pass("didn't error, migration successful")
})
