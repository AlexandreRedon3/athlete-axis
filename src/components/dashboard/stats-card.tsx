import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconColor?: string
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconColor = "text-primary" 
}: StatsCardProps) {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground transition-colors duration-200">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconColor} transition-colors duration-200`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground transition-colors duration-200">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground transition-colors duration-200">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
