import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('team_id')

    const rows = teamId
      ? await sql`
          SELECT p.*,
            t.name AS team_name,
            (t.captain_id       = p.id) AS is_captain,
            (t.vice_captain_id  = p.id) AS is_vice_captain,
            (t.wicketkeeper_id  = p.id) AS is_wicketkeeper_role
          FROM players p
          LEFT JOIN teams t ON p.team_id = t.id
          WHERE p.team_id = ${Number(teamId)}
          ORDER BY p.created_at DESC
        `
      : await sql`
          SELECT p.*,
            t.name AS team_name,
            (t.captain_id       = p.id) AS is_captain,
            (t.vice_captain_id  = p.id) AS is_vice_captain,
            (t.wicketkeeper_id  = p.id) AS is_wicketkeeper_role
          FROM players p
          LEFT JOIN teams t ON p.team_id = t.id
          ORDER BY p.created_at DESC
        `

    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const name      = form.get('name') as string
    const prevTeam  = form.get('previous_team') as string | null
    const type      = form.get('type') as string
    const phone     = form.get('phone') as string | null
    const teamName  = form.get('team_name') as string | null
    const photoFile = form.get('photo') as File | null

    if (!name?.trim() || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 })
    }

    const sql = getDb()

    // Auto-create team
    let teamId: number | null = null
    if (teamName?.trim()) {
      const t = await sql`
        INSERT INTO teams (name) VALUES (${teamName.trim()})
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `
      teamId = t[0].id
    }

    // Upload photo
    let photoUrl: string | null = null
    if (photoFile && photoFile.size > 0) {
      const { uploadImage } = await import('@/lib/cloudinary')
      const buf = Buffer.from(await photoFile.arrayBuffer())
      photoUrl = await uploadImage(buf, photoFile.name)
    }

    const rows = await sql`
      INSERT INTO players (name, previous_team, type, phone, photo_url, team_id)
      VALUES (${name.trim()}, ${prevTeam || null}, ${type}, ${phone || null}, ${photoUrl}, ${teamId})
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
