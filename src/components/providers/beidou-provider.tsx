'use client'

import { useEffect, useRef } from 'react'
import Beidou from '@sayagodev/beidou'

export default function BeidouProvider() {
  const nav = useRef<Beidou | null>(null)

  useEffect(() => {
    nav.current = new Beidou({})
    return () => nav.current?.destroy()
  }, [])

  return null
}
