"use client"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { useTheme } from "@/lib/theme-provider";
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-[#E2F163] text-[#2F455C] hover:bg-[#d8e859]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]",
        white: "bg-white text-[#2F455C] hover:bg-gray-100",
        dark: "bg-[#2F455C] text-white border border-white hover:bg-[#1a2e3d]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const { colors } = useTheme();
    
    // Appliquer les couleurs du thème pour la variante outline
    const getButtonClasses = () => {
      if (variant === 'outline') {
        return cn(
          buttonVariants({ variant: undefined, size, className }),
          `${colors.border} ${colors.text} hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`
        );
      }
      return buttonVariants({ variant, size, className });
    };
    
    return (
      <Comp
        className={getButtonClasses()}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
