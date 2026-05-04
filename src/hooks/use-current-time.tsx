'use client'

import { useEffect, useState } from 'react'
import { Temporal } from '@js-temporal/polyfill'

type TimePeriod = 'morning' | 'afternoon' | 'night'

const getCurrentTime = () => {
  const now = Temporal.Now.zonedDateTimeISO('America/Mexico_City')
  const hour = now.hour
  const minute = now.minute.toString().padStart(2, '0')
  const isAm = hour < 12
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  const period = isAm ? 'a.m.' : 'p.m.'
  const time = `${displayHour}:${minute} ${period}`

  let periodKey: TimePeriod
  if (hour >= 6 && hour < 12) {
    periodKey = 'morning'
  } else if (hour >= 12 || hour < 2) {
    periodKey = 'afternoon'
  } else {
    periodKey = 'night'
  }

  return { time, periodKey }
}

export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(getCurrentTime)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return currentTime
}
