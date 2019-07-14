# QSPG: Quick Simple Postgres Schema

For most databases, migrations can be done with serially executed migration scripts. This library enables you to quickly write a schema, and keep your database up to date without learning any custom migration tools/libraries.

Simply create a folder called "migrations" and fill with SQL scripts in alphanumeric order of execution, e.g. `v01.sql`, `v02.sql`... Then execute `npx qspg update ./migrations` update your database to the latest version of your schema.

Every time you want to adjust your schema, just add a new script and run `qspg update ./migrations` and your database will be up to date!

## How does it work?

QSPG creates a table `public.qspg_metakeystore` with a `db_version` key. Every time a sql script is added to your migrations directory, QSPG notes the version number of the database, and adjusts the `db_version` such that each script is run exactly once and in order.

## Connecting to the database

QSPG can also help you connect to the database via KnexJS. Every time you connect via QSPG, it will run any new migration scripts on the database to ensure the database is up to date.

```javascript
import qspg from "qspg"
import path from "path"

const conn = qspg({
  migrationsDir: path.resolve("./migrations"),

  // Optional: If set to true, QSPG will create a database with a randomized name, this is
  // great for unit tests
  testMode: false,

  // Optional: If seed is true and the seedDir is specified, qspg will seed the
  // database when it's created. This is best used in conjunction with testMode.
  seedDir: path.resolve("./seed"),
  seed: false
})

// Logs a table "users"
conn("users")
  .select("*")
  .then(console.log)
```

## Database Connection

You should have the following environment variables set so QSPG can connect to your database.

| Environment Variable | Default   |
| -------------------- | --------- |
| POSTGRES_HOST        | localhost |
| POSTGRES_PORT        | 5432      |
| POSTGRES_USER        | postgres  |
| POSTGRES_PASS        |           |
| POSTGRES_DATABASE    | postgres  |

## Commands

| Command                                    | Description                                                                                                                                  |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `qspg update $MIGRATIONS_DIR`              | Update the database using the scripts within `$MIGRATIONS_DIR`. Updates the `db_version` appropriately.                                      |
| `qspg compile $MIGRATIONS_DIR migrate.sql` | Compile the scripts within `$MIGRATIONS_DIR` to generate a `migrate.sql` that, when executed, runs each script and updates the `db_version`. |
| `qspg init`                                | Creates a reference project/bootstrap project for QSPG. Highly recommended.                                                                  |
