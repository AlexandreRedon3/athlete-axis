import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  title: string
  description?: string
  buttonText?: string
  buttonIcon?: LucideIcon
  onButtonClick?: () => void
}

export function SectionHeader({ title, description, buttonText, buttonIcon: Icon, onButtonClick }: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[#2F455C]">{title}</h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      {buttonText && (
        <Button onClick={onButtonClick} className="mt-4 md:mt-0 bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          {buttonText}
        </Button>
      )}
    </div>
  )
}
