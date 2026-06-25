import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.CAL_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { bookings: [], warning: 'CAL_API_KEY no configurada en .env.local' },
      { status: 200 }
    )
  }

  try {
    const res = await fetch(
      `https://api.cal.com/v1/bookings?apiKey=${apiKey}`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      return NextResponse.json(
        { bookings: [], error: `Cal.com respondió con error ${res.status}` },
        { status: 200 }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { bookings: [], error: 'No se pudo conectar con Cal.com' },
      { status: 200 }
    )
  }
}
