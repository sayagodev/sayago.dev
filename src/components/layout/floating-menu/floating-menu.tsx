"use client"

import { useCursor } from "@/components/layout/floating-menu/hooks/use-cursor"
import { useSwitchLanguage } from "@/components/layout/floating-menu/hooks/use-switch-language"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import { Languages, Menu, MousePointer2, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import {
  NAV_BUTTONS,
  bottomTransition,
  itemVariants,
  menuTransition,
  menuVariants,
} from "./constants"
import { useFloatingMenu } from "./hooks/use-floating-menu"

const MotionButton = motion.create(Button)

interface MenuItemProps {
  icon: React.ElementType
  label: string
  onClick?: () => void
  isDanger?: boolean
}

function MenuItem({ icon: Icon, label, onClick, isDanger }: MenuItemProps) {
  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
        isDanger
          ? "hover:bg-neutral text-red-600"
          : "text-neutral hover:bg-neutral hover:text-background"
      )}
    >
      <Icon size={18} strokeWidth={2} />
      {label}
    </motion.button>
  )
}

export function FloatingMenu() {
  const { isHome, isOpen, setIsOpen, shouldShow, isActive, menuRef } = useFloatingMenu()

  const { isCustomCursorEnabled, toggleCustomCursor } = useCursor()
  const { switchLocale, locale } = useSwitchLanguage()

  if (isHome) return null

  const buttonBaseClasses =
    "px-1 py-px md:px-1 md:py-1 font-zi text-2xl md:text-4xl text-neutral rounded-lg hover:bg-neutral hover:text-background"
  const activeClasses = "bg-neutral text-background"

  return (
    <motion.div
      className="fixed left-1/2 z-50 -translate-x-1/2"
      ref={menuRef}
      animate={{ bottom: "32px" }}
      transition={bottomTransition}
    >
      <AnimatePresence mode="wait">
        {shouldShow && (
          <motion.div
            className="bg-background border-neutral flex items-center gap-1 rounded-xl border-2 px-1 py-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={menuTransition}
          >
            {/* Botones de navegación */}
            <div className="flex items-center gap-1 px-px">
              {NAV_BUTTONS.map(({ href, icon, ariaLabel }) => (
                <MotionButton
                  key={href}
                  href={href}
                  whileTap="tap"
                  className={cn(buttonBaseClasses, isActive(href) && activeClasses)}
                  aria-label={ariaLabel}
                >
                  <span className="inline-block -translate-y-0.5">{icon}</span>
                </MotionButton>
              ))}
            </div>

            <div className="bg-neutral mx-1 h-6 w-px" />

            {/* Toggle del menú */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-xl px-2 py-2 transition-colors",
                isOpen
                  ? "bg-neutral text-background shadow-md"
                  : "text-neutral hover:text-background hover:bg-neutral"
              )}
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                {isOpen ? (
                  <X strokeWidth={2.5} className="size-5 md:size-[25px]" />
                ) : (
                  <Menu strokeWidth={2.5} className="size-5 md:size-[25px]" />
                )}
              </motion.div>
            </motion.button>

            {/* Dropdown del menú */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-background border-neutral absolute right-0 bottom-full mb-3 w-64 origin-top-right overflow-hidden rounded-xl border-2 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                >
                  <div className="flex flex-col gap-0.5">
                    <MenuItem
                      icon={MousePointer2}
                      label={`Cursor: ${isCustomCursorEnabled ? "On" : "Off"}`}
                      onClick={toggleCustomCursor}
                    />
                    <MenuItem
                      icon={Languages}
                      label={`Language: ${locale.toUpperCase()}`}
                      onClick={() => switchLocale(locale)}
                    />
                    {/* <MenuItem icon={HelpCircle} label="Help & Support" />
                    <div className="h-px bg-neutral my-1 mx-2" />
                    <MenuItem icon={LogOut} label="Sign Out" isDanger /> */}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
