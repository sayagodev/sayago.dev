'use client'

// Muestra el instante en la zona horaria del navegador que ve el admin.
// El servidor pinta su propia versión y el cliente la corrige al hidratar
// (suppressHydrationWarning cubre esa diferencia esperada).
function formatLocal(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const parts = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(d)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('year')}.${get('month')}.${get('day')} ${get('hour')}:${get('minute')}`
}

export function LocalTime({ iso }: { iso: string }) {
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {formatLocal(iso)}
    </time>
  )
}
