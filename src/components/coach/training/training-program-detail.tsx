"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Dumbbell, Users, Clock, Calendar, Plus, Edit } from "lucide-react"
import { TrainingSessionsList } from "@/components/coach/training/training-sessions-list"
import { AssignProgramDialog } from "@/components/coach/training/assign-program-dialog"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface TrainingProgramDetailProps {
  program: {
    id: string
    name: string
    description: string
    level: string
    duration: string
    sessions: number
    createdAt: string
    clients: number
  }
  onBack: () => void
}

export function TrainingProgramDetail({ program, onBack }: TrainingProgramDetailProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant":
        return "bg-green-100 text-green-800"
      case "Intermédiaire":
        return "bg-blue-100 text-blue-800"
      case "Avancé":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Simuler un appel API pour récupérer les sessions du programme
  const sessions = [
    {
      id: "1",
      name: "Séance 1 - Introduction",
      type: "Cardio",
      duration: "45 min",
      exercises: [
        { name: "Échauffement", sets: 1, reps: "5 min" },
        { name: "Course légère", sets: 1, reps: "15 min" },
        { name: "Vélo", sets: 1, reps: "15 min" },
        { name: "Étirements", sets: 1, reps: "10 min" },
      ],
    },
    {
      id: "2",
      name: "Séance 2 - Haut du corps",
      type: "Musculation",
      duration: "60 min",
      exercises: [
        { name: "Échauffement", sets: 1, reps: "5 min" },
        { name: "Pompes", sets: 3, reps: "10-12" },
        { name: "Tractions", sets: 3, reps: "8-10" },
        { name: "Développé épaules", sets: 3, reps: "12" },
        { name: "Curl biceps", sets: 3, reps: "12" },
        { name: "Étirements", sets: 1, reps: "10 min" },
      ],
    },
    {
      id: "3",
      name: "Séance 3 - Bas du corps",
      type: "Musculation",
      duration: "60 min",
      exercises: [
        { name: "Échauffement", sets: 1, reps: "5 min" },
        { name: "Squats", sets: 3, reps: "12-15" },
        { name: "Fentes", sets: 3, reps: "10 par jambe" },
        { name: "Extensions quadriceps", sets: 3, reps: "12" },
        { name: "Curl ischio-jambiers", sets: 3, reps: "12" },
        { name: "Étirements", sets: 1, reps: "10 min" },
      ],
    },
  ]

  // Simuler un appel API pour récupérer les clients assignés à ce programme
  const assignedClients = [
    { id: "1", name: "Sophie Martin", progress: 75 },
    { id: "2", name: "Thomas Dubois", progress: 45 },
    { id: "3", name: "Julie Petit", progress: 30 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold text-[#2F455C]">Détails du programme</h2>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Dumbbell className="h-6 w-6 text-[#21D0B2] mr-3" />
              <div>
                <CardTitle className="text-xl">{program.name}</CardTitle>
                <p className="text-sm text-gray-500">Créé le {new Date(program.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
              <Button
                className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]"
                onClick={() => setIsAssignDialogOpen(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Assigner
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{program.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Badge className={`mr-2 ${getLevelColor(program.level)}`}>{program.level}</Badge>
              <span>Niveau</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span>{program.sessions} séances</span>
            </div>
          </div>

          <Tabs defaultValue="sessions">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="sessions">Séances ({sessions.length})</TabsTrigger>
              <TabsTrigger value="clients">Clients assignés ({assignedClients.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="sessions" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Liste des séances</h3>
                <Button className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une séance
                </Button>
              </div>
              <TrainingSessionsList sessions={sessions} />
            </TabsContent>
            <TabsContent value="clients" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Clients suivant ce programme</h3>
                <Button
                  className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]"
                  onClick={() => setIsAssignDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Assigner à un client
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-gray-500">Nom</th>
                        <th className="text-left p-4 font-medium text-gray-500">Progression</th>
                        <th className="text-left p-4 font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedClients.map((client, index) => (
                        <tr
                          key={client.id}
                          className={
                            index < assignedClients.length - 1 ? "border-b hover:bg-gray-50" : "hover:bg-gray-50"
                          }
                        >
                          <td className="p-4">{client.name}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div
                                  className="h-full bg-[#21D0B2] rounded-full"
                                  style={{ width: `${client.progress}%` }}
                                ></div>
                              </div>
                              <span>{client.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm" className="text-[#21D0B2]">
                              Voir détails
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AssignProgramDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        programId={program.id}
        programName={program.name}
      />
    </div>
  )
}
