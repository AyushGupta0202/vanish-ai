import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-base disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white text-ink-base shadow-[0_24px_80px_rgba(0,0,0,0.55)] hover:bg-white/95",
        destructive:
          "bg-[#FF4D4D] text-white hover:bg-[#FF4D4D]/90",
        outline:
          "border border-white/16 bg-white/7 text-white/90 backdrop-blur-xl hover:bg-white/10",
        secondary:
          "border border-white/12 bg-white/6 text-white/80 backdrop-blur-xl hover:bg-white/10 hover:text-white/92",
        ghost: "bg-transparent text-white/72 hover:bg-white/8 hover:text-white/92",
        link: "text-aurora-cyan underline-offset-4 hover:underline hover:text-aurora-cyan/80",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

 export { Button }

