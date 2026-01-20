'use client'

import { MaskIcon } from "@/utils/mask-icon";
import version from '@/public/images/zhongwen/version.svg';
import { VERSION } from "@/version";
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

export function ShowVersion() {
    const t = useTranslations("home");
    const [isHover, setIsHover] = useState(false);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    // Seguimiento del mouse (en viewport) con suavizado
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 600, damping: 40, mass: 0.2 });
    const ySpring = useSpring(y, { stiffness: 600, damping: 40, mass: 0.2 });

    useEffect(() => {
        // Evita ReferenceError en SSR; solo accede a document en cliente
        setPortalTarget(document.body);
    }, []);

    useEffect(() => {
        // Posición inicial conocida: fuera de pantalla a la izquierda, centrado vertical
        if (typeof window !== "undefined") {
            x.set(-160);
            y.set(window.innerHeight / 2);
        }
    }, [x, y]);

    return (
        <>
            <motion.div
                className="hidden lg:flex absolute top-1/2 left-5 -translate-y-1/2 flex-col items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.3, ease: "easeOut" }}
                onMouseEnter={(e) => {
                    // Posiciona antes de montar el tooltip para evitar "salto" inicial
                    x.set(e.clientX);
                    y.set(e.clientY - 16);
                    setIsHover(true);
                }}
                onMouseLeave={() => setIsHover(false)}
                onMouseMove={(e) => {
                    // Coordenadas en viewport: clientX/Y
                    x.set(e.clientX);
                    y.set(e.clientY - 16); // pequeño offset hacia arriba
                }}
            >
                <MaskIcon src={version.src} className="size-10" />
                <span className="font-argon font-medium">{VERSION}</span>
            </motion.div>

            {portalTarget && createPortal(
                <AnimatePresence>
                    {isHover && (
                        <motion.div
                            className="fixed z-50 pointer-events-none"
                            style={{
                                left: xSpring,
                                top: ySpring,
                                translateY: "-100%",
                            }}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.12, ease: "easeOut" }}
                        >
                            <div className="bg-info py-1 px-2">
                                <p className="font-neon text-xl font-medium text-info-content">{`${t("version", { version: VERSION })} `}
                                    <motion.span
                                        className="inline-block -translate-y-[2px] -translate-x-[2px]"
                                        animate={{ x: [0, 2, 0, -2, 0], y: [0, 2, 0, 2, 0] }}
                                        transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
                                    >
                                        🥳
                                    </motion.span>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                portalTarget
            )}
        </>
    )

}