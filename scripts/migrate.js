// Run: node scripts/migrate.js
// Make sure DATABASE_URL is set in .env.local or as env variable

const { neon } = require('@neondatabase/serverless')

// Load .env.local manually
const fs = require('fs')
const path = require('path')
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').replace(/^"|"$/g, '').trim()
  })
}

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('❌  DATABASE_URL not set')
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)
  console.log('Running migrations...')

  await sql`
    CREATE TABLE IF NOT EXISTS teams (
      id               SERIAL PRIMARY KEY,
      name             VARCHAR(100) UNIQUE NOT NULL,
      captain_id       INT,
      vice_captain_id  INT,
      wicketkeeper_id  INT,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS players (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(100) NOT NULL,
      previous_team VARCHAR(100),
      type          VARCHAR(20) CHECK (type IN ('batsman','bowler','all-rounder','wicketkeeper')) NOT NULL,
      phone         VARCHAR(30),
      photo_url     TEXT,
      team_id       INT REFERENCES teams(id) ON DELETE SET NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `

  console.log('✅  Migration complete!')
  process.exit(0)
}

migrate().catch(e => { console.error('❌  Migration error:', e.message); process.exit(1) })
