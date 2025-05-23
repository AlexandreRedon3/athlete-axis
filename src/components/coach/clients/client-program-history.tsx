import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Calendar, ArrowRight, Plus } from "lucide-react"

interface ClientProgramHistoryProps {
  clientId: string
}

export function ClientProgramHistory({ clientId }: ClientProgramHistoryProps) {
  // Simuler un appel API pour récupérer l'historique des programmes
  const programHistory = [
    {
      id: "1",
      name: "Programme de perte de poids",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      status: "En cours",
      progress: 75,
      sessions: 24,
      completedSessions: 18,
    },
    {
      id: "2",
      name: "Programme de renforcement",
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      status: "Terminé",
      progress: 100,
      sessions: 36,
      completedSessions: 36,
    },
    {
      id: "3",
      name: "Programme d'initiation",
      startDate: "2023-07-15",
      endDate: "2023-09-30",
      status: "Terminé",
      progress: 100,
      sessions: 24,
      completedSessions: 22,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#2F455C]">Programmes d'entraînement</h3>
        <Button className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
          <Plus className="h-4 w-4 mr-2" />
          Assigner un programme
        </Button>
      </div>

      <div className="space-y-4">
        {programHistory.map((program) => (
          <Card key={program.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="bg-[#21D0B2]/10 p-4 md:p-6 md:w-64 flex flex-col justify-center">
                  <div className="flex items-center mb-2">
                    <Dumbbell className="h-5 w-5 text-[#21D0B2] mr-2" />
                    <h4 className="font-bold">{program.name}</h4>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(program.startDate).toLocaleDateString()} -{" "}
                      {new Date(program.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Statut</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          program.status === "En cours"
                            ? "bg-[#21D0B2]/20 text-[#21D0B2]"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {program.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Progression</p>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                          <div
                            className="h-full bg-[#21D0B2] rounded-full"
                            style={{ width: `${program.progress}%` }}
                          ></div>
                        </div>
                        <span>{program.progress}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Séances</p>
                      <p className="font-medium">
                        {program.completedSessions}/{program.sessions} complétées
                      </p>
                    </div>

                    <Button variant="outline" className="md:self-end">
                      Détails <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
