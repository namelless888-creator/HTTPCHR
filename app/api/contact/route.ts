import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, email, message } = await req.json().catch(() => ({}));
  if (!name || !email || !message) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  // Stub: deliver to e-mail or CRM here.
  return NextResponse.json({ ok: true });
}
