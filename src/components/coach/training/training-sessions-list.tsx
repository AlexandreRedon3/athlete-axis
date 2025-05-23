"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Edit, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface Exercise {
  name: string
  sets: number
  reps: string
}

interface Session {
  id: string
  name: string
  type: string
  duration: string
  exercises: Exercise[]
}

interface TrainingSessionsListProps {
  sessions: Session[]
}

export function TrainingSessionsList({ sessions }: TrainingSessionsListProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)

  const toggleSession = (sessionId: string) => {
    if (expandedSessionId === sessionId) {
      setExpandedSessionId(null)
    } else {
      setExpandedSessionId(sessionId)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Cardio":
        return "bg-red-100 text-red-800"
      case "Musculation":
        return "bg-blue-100 text-blue-800"
      case "Flexibilité":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => toggleSession(session.id)}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <Badge className={getTypeColor(session.type)}>{session.type}</Badge>
                </div>
                <div>
                  <h4 className="font-medium">{session.name}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{session.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Action de modification
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {expandedSessionId === session.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            {expandedSessionId === session.id && (
              <div className="p-4 border-t bg-gray-50">
                <h5 className="font-medium mb-2">Exercices</h5>
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b">
                      <th className="text-left py-2">Exercice</th>
                      <th className="text-center py-2">Séries</th>
                      <th className="text-center py-2">Répétitions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.exercises.map((exercise, index) => (
                      <tr key={index} className={index < session.exercises.length - 1 ? "border-b" : ""}>
                        <td className="py-2">{exercise.name}</td>
                        <td className="py-2 text-center">{exercise.sets}</td>
                        <td className="py-2 text-center">{exercise.reps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
