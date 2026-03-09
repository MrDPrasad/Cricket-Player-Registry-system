import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function POST() {
  try {
    const sql = getDb()
    await sql`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        captain_id INT,
        vice_captain_id INT,
        wicketkeeper_id INT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        previous_team VARCHAR(100),
        type VARCHAR(20) CHECK (type IN ('batsman','bowler','all-rounder','wicketkeeper')) NOT NULL,
        phone VARCHAR(30),
        photo_url TEXT,
        team_id INT REFERENCES teams(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
