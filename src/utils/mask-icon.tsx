import { cn } from "./cn"

type MaskIconProps = {
    src: string
    className?: string
}

export const MaskIcon = ({ src, className }: MaskIconProps) => (
    <span
        className={cn("inline-block bg-foreground", className)}
        style={{
            WebkitMaskImage: `url(${src})`,
            maskImage: `url(${src})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
        }}
        aria-hidden
    />
)