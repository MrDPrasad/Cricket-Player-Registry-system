import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = getDb()
    const pid = Number(params.id)
    await sql`
      UPDATE teams SET
        captain_id      = CASE WHEN captain_id      = ${pid} THEN NULL ELSE captain_id      END,
        vice_captain_id = CASE WHEN vice_captain_id = ${pid} THEN NULL ELSE vice_captain_id END,
        wicketkeeper_id = CASE WHEN wicketkeeper_id = ${pid} THEN NULL ELSE wicketkeeper_id END
      WHERE captain_id = ${pid} OR vice_captain_id = ${pid} OR wicketkeeper_id = ${pid}
    `
    await sql`DELETE FROM players WHERE id = ${pid}`
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
