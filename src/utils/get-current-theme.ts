'use client'

export function getCurrentTheme() {
    const theme = document.documentElement.getAttribute("data-theme") ?? "beish"

    return theme
}