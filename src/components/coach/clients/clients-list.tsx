"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserRound } from "lucide-react"
import { useState } from "react"
import { InviteClientButton } from "./invite-client-button"

interface Client {
  id: string
  name: string
  email: string
  goal: string
  activeProgram: string
  programProgress: number
}

interface ClientsListProps {
  clients: Client[]
  onSelectClient: (id: string) => void
}

export function ClientsList({ clients, onSelectClient }: ClientsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">Nom</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Objectif</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Programme</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Progression</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                  <tr
                    key={client.id}
                    className={index < filteredClients.length - 1 ? "border-b hover:bg-accent/50" : "hover:bg-accent/50"}
                  >
                    <td className="p-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <UserRound className="h-4 w-4 text-primary" />
                      </div>
                      {client.name}
                    </td>
                    <td className="p-4 hidden md:table-cell">{client.email}</td>
                    <td className="p-4 hidden lg:table-cell">{client.goal}</td>
                    <td className="p-4 hidden md:table-cell">{client.activeProgram}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mr-2">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${client.programProgress}%` }}
                          ></div>
                        </div>
                        <span className="whitespace-nowrap">{client.programProgress}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/90"
                        onClick={() => onSelectClient(client.id)}
                      >
                        Détails
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    Aucun client trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
