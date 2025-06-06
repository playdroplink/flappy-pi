
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm sm:text-base font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 select-none touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-blue-500/25",
        destructive: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-red-500/25",
        outline: "border-2 border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-gray-50 hover:border-gray-400 text-gray-700 shadow-gray-300/25",
        secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 shadow-gray-400/25",
        ghost: "hover:bg-gray-100/80 hover:text-gray-900 text-gray-600",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
      },
      size: {
        default: "h-11 sm:h-12 px-6 py-3 text-sm sm:text-base",
        sm: "h-9 sm:h-10 rounded-full px-4 text-xs sm:text-sm",
        lg: "h-12 sm:h-14 rounded-full px-8 text-base sm:text-lg font-bold",
        icon: "h-10 w-10 sm:h-12 sm:w-12",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
