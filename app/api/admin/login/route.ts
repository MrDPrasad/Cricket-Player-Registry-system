import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    const validUser = username === process.env.ADMIN_USERNAME
    const validPass = password === process.env.ADMIN_PASSWORD

    if (!validUser || !validPass) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_token', process.env.ADMIN_PASSWORD!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
