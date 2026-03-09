import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const sql = getDb()
    const rows = await sql`
      SELECT
        (SELECT COUNT(*)::int FROM players)                                    AS total_players,
        (SELECT COUNT(*)::int FROM teams)                                      AS total_teams,
        (SELECT COUNT(*)::int FROM players WHERE type = 'batsman')             AS batsmen,
        (SELECT COUNT(*)::int FROM players WHERE type = 'bowler')              AS bowlers,
        (SELECT COUNT(*)::int FROM players WHERE type = 'all-rounder')         AS allrounders,
        (SELECT COUNT(*)::int FROM players WHERE type = 'wicketkeeper')        AS wicketkeepers
    `
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
