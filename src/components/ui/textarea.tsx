import * as React from "react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/theme-provider";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { colors } = useTheme();
    return (
      <textarea
        className={cn(
          `flex min-h-[80px] w-full rounded-md border ${colors.border} ${colors.bg} ${colors.text} ring-offset-background placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
