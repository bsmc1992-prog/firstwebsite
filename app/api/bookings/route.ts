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
      'https://api.cal.com/v2/bookings',
      {
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'cal-api-version': '2024-08-13',
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { bookings: [], error: `Cal.com respondió con error ${res.status}` },
        { status: 200 }
      )
    }

    const data = await res.json()
    // v2 devuelve { status: "success", data: [...] }
    // normalizamos status a mayúsculas para compatibilidad con el panel
    const rawBookings = data.data ?? data.bookings ?? []
    const bookings = rawBookings.map((b: Record<string, unknown>) => ({
      ...b,
      status: typeof b.status === 'string' ? b.status.toUpperCase() : b.status,
    }))
    return NextResponse.json({ bookings })
  } catch {
    return NextResponse.json(
      { bookings: [], error: 'No se pudo conectar con Cal.com' },
      { status: 200 }
    )
  }
}
