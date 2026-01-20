'use client'

import { useEffect, useState } from "react";

const getCurrentTime = () => {
    const date = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/Mexico_City",
    })

    const dateFormatted = date.toLocaleLowerCase().replace(/\s?(am|pm)$/, m => m.includes("am") ? " a.m." : " p.m.")

    return dateFormatted
}

export function useCurrentTime() {
    const [time, setTime] = useState(getCurrentTime())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getCurrentTime())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return {
        time,
    }
}