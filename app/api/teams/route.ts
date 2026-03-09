import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const sql = getDb()
    const rows = await sql`
      SELECT
        t.*,
        cp.name  AS captain_name,
        vp.name  AS vice_captain_name,
        wk.name  AS wicketkeeper_name,
        (SELECT COUNT(*)::int FROM players WHERE team_id = t.id) AS player_count
      FROM teams t
      LEFT JOIN players cp ON t.captain_id    = cp.id
      LEFT JOIN players vp ON t.vice_captain_id = vp.id
      LEFT JOIN players wk ON t.wicketkeeper_id = wk.id
      ORDER BY t.created_at DESC
    `
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })
    const sql = getDb()
    const rows = await sql`
      INSERT INTO teams (name) VALUES (${name.trim()})
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
