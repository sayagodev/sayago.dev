'use client';

import { useEffect, useState } from "react";

interface EntryOverlayProps {
    durationMs?: number;
}

export function EntryOverlay({ durationMs = 1200 }: EntryOverlayProps) {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setHidden(true), durationMs);
        return () => clearTimeout(timeout);
    }, [durationMs]);

    return (
        <div
            className={`fixed inset-0 z-30 flex items-center justify-center bg-(--color-warning) transition-opacity duration-700 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
        >
            <h1 className="text-4xl font-krypton tracking-wide text-neutral font-bold">
                sāyago;dev
            </h1>
        </div>
    );
}