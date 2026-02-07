"use client"

import { X } from "lucide-react"
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { useEffect } from "react"

interface ProjectDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (value: string) => void
  details: string
}

export function ProjectDetailsModal({
  isOpen,
  onClose,
  onSave,
  details,
  ...props
}: ProjectDetailsModalProps) {
  const maxLength = 500

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleSave = () => {
    onSave(details)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Minimal backdrop */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="fixed inset-0 z-50 min-h-screen bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0.2,
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background pointer-events-auto w-full max-w-xl overflow-hidden rounded-xl shadow-2xl"
            >
              <div className="p-8">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <motion.h3
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.1,
                      }}
                      className="font-argon text-foreground text-2xl font-bold"
                    >
                      Cuéntame más
                    </motion.h3>
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.15,
                      }}
                      className="text-foreground mt-1 text-sm"
                    >
                      Referencias, plazos, requisitos...
                    </motion.p>
                  </div>
                  <motion.button
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                    onClick={onClose}
                    className="text-foreground hover:text-background hover:bg-primary -m-2 rounded-full p-2 transition-all"
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Textarea */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.2,
                  }}
                  className="relative"
                >
                  <textarea
                    placeholder="Escribe aquí los detalles de tu proyecto..."
                    className="border-neutral/30 focus:bg-background focus:border-primary focus:ring-primary text-foreground/90 placeholder:text-foreground/50 modal-textarea h-48 w-full resize-none overflow-y-auto rounded-xl border-2 border-dashed bg-transparent p-5 text-base transition-all outline-none focus:border-solid focus:ring-2"
                    autoFocus
                    maxLength={maxLength}
                    {...props}
                  />

                  {/* Character count */}
                  <div className="bg-background/80 absolute right-4 bottom-4 z-10 flex items-center gap-2 rounded-md px-2 py-1 backdrop-blur-xs">
                    <span
                      className={`text-xs font-medium ${details.length > maxLength * 0.9 ? "text-warning" : "text-neutral"}`}
                    >
                      {details.length}
                    </span>
                    <span className="text-neutral/80 text-xs">/</span>
                    <span className="text-neutral text-xs">{maxLength}</span>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.3,
                  }}
                  className="mt-6 flex items-center justify-between"
                >
                  <button
                    onClick={onClose}
                    className="text-foreground/70 hover:text-foreground text-base font-medium transition-colors md:text-lg"
                    type="button"
                  >
                    Cancelar
                  </button>

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={handleSave}
                    className="bg-primary text-background hover:bg-primary/80 shadow-primary/10 rounded-xl px-2 py-2 text-lg font-bold shadow-lg transition-colors md:px-3 md:py-3 md:text-xl"
                    type="button"
                  >
                    Guardar
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
