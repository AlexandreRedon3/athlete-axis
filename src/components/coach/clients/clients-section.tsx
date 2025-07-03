"use client"

import { useState } from "react"
import { SectionHeader } from "@/components/dashboard/section-header"
import { ClientsList } from "@/components/coach/clients/clients-list"
import { ClientDetail } from "@/components/coach/clients/client-detail"
import { AddClientForm } from "@/components/coach/clients/add-client-form"
import { UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InviteClientButton } from "./invite-client-button"

export function ClientsSection() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)

  // Simuler un appel API pour récupérer les clients
  const clients = [
    {
      id: "1",
      name: "Sophie Martin",
      age: 28,
      goal: "Perte de poids",
      weight: 65,
      height: 168,
      email: "sophie.martin@example.com",
      phone: "06 12 34 56 78",
      joinedDate: "2023-09-15",
      activeProgram: "Programme de perte de poids",
      programProgress: 75,
    },
    {
      id: "2",
      name: "Thomas Dubois",
      age: 35,
      goal: "Prise de masse",
      weight: 78,
      height: 182,
      email: "thomas.dubois@example.com",
      phone: "06 23 45 67 89",
      joinedDate: "2023-10-22",
      activeProgram: "Programme de musculation",
      programProgress: 45,
    },
    {
      id: "3",
      name: "Julie Petit",
      age: 31,
      goal: "Amélioration de l'endurance",
      weight: 58,
      height: 165,
      email: "julie.petit@example.com",
      phone: "06 34 56 78 90",
      joinedDate: "2023-11-05",
      activeProgram: "Programme cardio avancé",
      programProgress: 30,
    },
    {
      id: "4",
      name: "Marc Leroy",
      age: 42,
      goal: "Remise en forme",
      weight: 88,
      height: 178,
      email: "marc.leroy@example.com",
      phone: "06 45 67 89 01",
      joinedDate: "2024-01-10",
      activeProgram: "Programme débutant",
      programProgress: 15,
    },
  ]

  const selectedClient = clients.find((client) => client.id === selectedClientId)

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <InviteClientButton />
      </div>

      {selectedClientId ? (
        <ClientDetail client={selectedClient!} onBack={() => setSelectedClientId(null)} />
      ) : (
        <ClientsList clients={clients} onSelectClient={(id) => setSelectedClientId(id)} />
      )}
    </div>
  )
}
