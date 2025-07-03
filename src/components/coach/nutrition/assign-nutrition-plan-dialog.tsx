"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Check, Loader2 } from "lucide-react"

interface AssignNutritionPlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
  planName: string
}

export function AssignNutritionPlanDialog({ open, onOpenChange, planId, planName }: AssignNutritionPlanDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simuler un appel API pour récupérer les clients non assignés à ce plan
  const availableClients = [
    { id: "5", name: "Emma Blanc", email: "emma.blanc@example.com" },
    { id: "6", name: "Lucas Moreau", email: "lucas.moreau@example.com" },
    { id: "7", name: "Camille Dubois", email: "camille.dubois@example.com" },
    { id: "8", name: "Antoine Martin", email: "antoine.martin@example.com" },
  ]

  const filteredClients = availableClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleClientSelection = (clientId: string) => {
    if (selectedClientIds.includes(clientId)) {
      setSelectedClientIds(selectedClientIds.filter((id) => id !== clientId))
    } else {
      setSelectedClientIds([...selectedClientIds, clientId])
    }
  }

  const handleAssign = async () => {
    if (selectedClientIds.length === 0) return

    setIsSubmitting(true)
    try {
      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(`Plan nutritionnel ${planId} assigné aux clients:`, selectedClientIds)
      onOpenChange(false)
      // Réinitialiser la sélection
      setSelectedClientIds([])
    } catch (error) {
      console.error("Erreur lors de l'assignation du plan nutritionnel:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assigner le plan nutritionnel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Sélectionnez les clients auxquels vous souhaitez assigner le plan <strong>{planName}</strong>.
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border rounded-md max-h-60 overflow-y-auto">
            {filteredClients.length > 0 ? (
              <ul className="divide-y">
                {filteredClients.map((client) => (
                  <li
                    key={client.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleClientSelection(client.id)}
                  >
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        selectedClientIds.includes(client.id) ? "bg-[#21D0B2] text-white" : "border border-gray-300"
                      }`}
                    >
                      {selectedClientIds.includes(client.id) && <Check className="h-3 w-3" />}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-3 text-center text-gray-500">Aucun client trouvé</p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm">
              {selectedClientIds.length} client{selectedClientIds.length !== 1 ? "s" : ""} sélectionné
              {selectedClientIds.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleAssign}
                disabled={selectedClientIds.length === 0 || isSubmitting}
                className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Assignation..." : "Assigner"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
