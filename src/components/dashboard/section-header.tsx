import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  title: string
  description?: string
  buttonText?: string
  buttonIcon?: LucideIcon
  onButtonClick?: () => void
}

export function SectionHeader({ 
  title, 
  description, 
  buttonText, 
  buttonIcon: Icon, 
  onButtonClick 
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold dark:text-foreground text-foreground transition-colors duration-200">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground dark:text-muted-foreground transition-colors duration-200">
            {description}
          </p>
        )}
      </div>
      {buttonText && (
        <Button 
          onClick={onButtonClick} 
          className="mt-4 md:mt-0 bg-primary dark:bg-primary dark:text-primary-foreground text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
        >
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          {buttonText}
        </Button>
      )}
    </div>
  )
}
