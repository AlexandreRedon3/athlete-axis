"use client"

import { useState } from "react"
import { SectionHeader } from "@/components/dashboard/section-header"
import { TrainingProgramsList } from "@/components/coach/training/training-programs-list"
import { TrainingProgramDetail } from "@/components/coach/training/training-program-detail"
import { CreateProgramForm } from "@/components/coach/training/create-program-form"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"

export function TrainingSection() {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false)


  // Simuler un appel API pour récupérer les programmes
  const fetchPrograms = async () => {
    const response = await fetch("/api/programs")
    return response.json()
  }

  const { data: programs, isLoading, error } = useQuery({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
  })

  console.log("programs : ", programs)

  const programList = [
    {
      id: "1",
      name: "Programme de perte de poids",
      description: "Programme conçu pour la perte de poids progressive et durable",
      level: "Débutant",
      duration: "12 semaines",
      sessions: 36,
      createdAt: "2023-12-10",
      clients: 5,
    },
    {
      id: "2",
      name: "Programme de musculation",
      description: "Programme de renforcement musculaire pour une prise de masse",
      level: "Intermédiaire",
      duration: "8 semaines",
      sessions: 24,
      createdAt: "2024-01-15",
      clients: 3,
    },
    {
      id: "3",
      name: "Programme cardio avancé",
      description: "Programme d'endurance pour améliorer les performances cardiovasculaires",
      level: "Avancé",
      duration: "6 semaines",
      sessions: 18,
      createdAt: "2024-02-20",
      clients: 2,
    },
    {
      id: "4",
      name: "Programme débutant",
      description: "Programme d'initiation au fitness pour les débutants complets",
      level: "Débutant",
      duration: "4 semaines",
      sessions: 12,
      createdAt: "2024-03-05",
      clients: 8,
    },
  ]

  const selectedProgram = programs?.find((program: any) => program.id === selectedProgramId)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gestion des entraînements"
        description="Créez et gérez vos programmes d'entraînement"
        buttonText="Créer un programme"
        buttonIcon={Plus}
        onButtonClick={() => setIsCreateProgramOpen(true)}
      />
      
      {selectedProgramId ? (
        <TrainingProgramDetail program={selectedProgram!} onBack={() => setSelectedProgramId(null)} />
      ) : (
        <TrainingProgramsList programs={programs} onSelectProgram={(id) => setSelectedProgramId(id)} />
      )}

      <Dialog open={isCreateProgramOpen} onOpenChange={setIsCreateProgramOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau programme</DialogTitle>
          </DialogHeader>
          <CreateProgramForm
            onSubmit={() => {
              setIsCreateProgramOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
