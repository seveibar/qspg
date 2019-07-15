const template = versions =>
  `
-- ---------------------- --
-- THIS FILE IS GENERATED --
-- DO NOT EDIT            --
-- ---------------------- --

DO $MAIN$
DECLARE
    db_version integer;
BEGIN
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "qspg_metakeystore" (
    key_id character varying(255) PRIMARY KEY,
    integer_value integer,
    string_value character varying(255)
);

IF NOT EXISTS (SELECT 1 FROM qspg_metakeystore WHERE key_id='db_version') THEN
    RAISE NOTICE 'Setting db_version to 0';
    INSERT INTO qspg_metakeystore (key_id, integer_value) VALUES ('db_version', 0);
END IF;

db_version := (SELECT integer_value FROM qspg_metakeystore WHERE key_id='db_version');

RAISE NOTICE 'DATABASE VERSION = %', db_version;

${versions
  .map(
    (sql, i) =>
      `-- --------------------------------------------
-- VERSION ${i + 1}
-- --------------------------------------------

IF (db_version=${i}) THEN
    RAISE NOTICE 'Migrating db_version to ${i + 1}';

${sql
  .toString()
  .split("\n")
  .map(l => "    " + l)
  .join("\n")}

    UPDATE qspg_metakeystore SET integer_value=${i +
      1} WHERE key_id='db_version';
    db_version := (SELECT integer_value FROM qspg_metakeystore WHERE key_id='db_version');
END IF;

`
  )
  .join("")}

END
$MAIN$ LANGUAGE plpgsql;`.trim()

module.exports = migrationsDir => {
  const fs = require("fs")
  const path = require("path")

  const versions = fs
    .readdirSync(migrationsDir)
    .filter(n => n.endsWith(".sql"))
    .sort()
    .map(
      n =>
        `-- File Name: ${n}\n\n${fs
          .readFileSync(path.join(migrationsDir, n))
          .toString()}`
    )

  return template(versions)
}
