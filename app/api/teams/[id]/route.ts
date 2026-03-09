import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const sql = getDb()
    const rows = await sql`
      UPDATE teams SET
        name             = COALESCE(${body.name ?? null}, name),
        captain_id       = ${body.captain_id ?? null},
        vice_captain_id  = ${body.vice_captain_id ?? null},
        wicketkeeper_id  = ${body.wicketkeeper_id ?? null}
      WHERE id = ${Number(params.id)}
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = getDb()
    await sql`UPDATE players SET team_id = NULL WHERE team_id = ${Number(params.id)}`
    await sql`DELETE FROM teams WHERE id = ${Number(params.id)}`
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
