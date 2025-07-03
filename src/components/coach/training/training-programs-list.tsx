"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Dumbbell, Users, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

interface Program {
  id: string
  name: string
  description: string
  level: string
  duration: string
  sessions: number
  createdAt: string
  clients: number
}

interface TrainingProgramsListProps {
  programs: Program[]
  onSelectProgram: (id: string) => void
}

export function TrainingProgramsList({ programs, onSelectProgram }: TrainingProgramsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([])

  useEffect(() => {
    if (programs) {
      const filtered = programs.filter((program) =>
        program.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPrograms(filtered)
    }
  }, [searchQuery, programs])

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant":
        return "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
      case "Intermédiaire":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
      case "Avancé":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un programme..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.length > 0 && filteredPrograms ? (
          filteredPrograms.map((program) => (
            <Card key={program.id} className="overflow-hidden hover:shadow-md transition-shadow h-full">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="p-4 border-b bg-primary/5 dark:bg-primary/10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Dumbbell className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-bold text-foreground">{program.name}</h3>
                    </div>
                    <Badge className={getLevelColor(program.level)}>{program.level}</Badge>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{program.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">{program.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">{program.clients} clients</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button
                      onClick={() => onSelectProgram(program.id)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Voir les détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">Aucun programme trouvé</div>
        )}
      </div>
    </div>
  )
}
