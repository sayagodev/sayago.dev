import * as motion from "motion/react-client"
import { LayoutGroup } from "motion/react"
import TextRotate from "./text-rotate"

interface ContactTitleProps {
  title1: string
  title2: string
  messages: string[]
}

export function ContactTitle({ messages, title1, title2 }: ContactTitleProps) {
  return (
    <div className="font-argon text-2xl font-bold md:text-3xl lg:text-5xl">
      <LayoutGroup>
        <p className="text-center md:mb-1.5 lg:mb-2 lg:text-start">
          {title1}
          <span className="xs:hidden"> {title2}</span>
        </p>
        <motion.p
          className="flex flex-row flex-wrap items-center justify-center gap-x-2 lg:justify-start"
          layout
        >
          <motion.span layout transition={{ type: "spring", damping: 30, stiffness: 400 }}>
            <span className="xs:inline hidden">{title2} </span>
          </motion.span>
          <TextRotate
            as="span"
            texts={messages}
            mainClassName="text-background font-bold px-2 sm:px-2 md:px-3 bg-primary overflow-hidden py-1 justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={3000}
          />
        </motion.p>
      </LayoutGroup>
    </div>
  )
}
