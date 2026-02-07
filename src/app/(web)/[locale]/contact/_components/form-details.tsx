"use client"

import { cn } from "@/utils/cn"
import { Edit3 } from "lucide-react"
import { motion, Variants } from "motion/react"
import { useState } from "react"
import { ProjectDetailsModal } from "./project-details-modal"
import { useIsMobile } from "@/hooks/use-mobile"

interface FormDetailsProps {
  variants: Variants
  details: string
  detailsLabel: string
  detailsValue: string
  onSave: (value: string) => void
}

export function FormDetails({
  variants,
  details,
  detailsLabel,
  detailsValue,
  onSave,
  ...props
}: FormDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <>
      <motion.div variants={variants} className="flex flex-wrap items-baseline gap-x-2 gap-y-4">
        {isMobile ? (
          <span className="text-neutral/50 text-xl">Opc -</span>
        ) : (
          <span className="text-neutral/50 text-2xl">Opcional -</span>
        )}
        <span>{details}</span>
        <button
          onClick={() => {
            setIsModalOpen(true)
          }}
          className={cn(
            "group text-neutral/60 placeholder-neutral/40 relative flex max-w-lg min-w-[300px] items-baseline justify-between gap-4 bg-transparent px-4 py-1 md:text-2xl lg:text-3xl"
          )}
          type="button"
        >
          {detailsValue ? (
            <span className="italic">{getTruncatedDetails(detailsValue)}</span>
          ) : (
            <span className="truncate opacity-60 transition-opacity group-hover:opacity-80">
              {detailsLabel}
            </span>
          )}
          <Edit3 className="h-5 w-5 opacity-60 transition-all group-hover:scale-110 group-hover:opacity-100" />
          <div className="bg-neutral/40 absolute bottom-0 left-0 z-0 h-0.5 w-full"></div>
        </button>
      </motion.div>

      {/* Details Modal */}
      <ProjectDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSave}
        details={detailsValue}
        {...props}
      />
    </>
  )
}

const getTruncatedDetails = (details: string) => {
  if (!details) return "detalles de tu proyecto"
  return details.length > 15 ? details.substring(0, 15) + "..." : details
}
