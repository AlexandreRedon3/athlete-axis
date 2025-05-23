"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserRound } from "lucide-react"
import { useState } from "react"

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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un client..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-gray-500">Nom</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden lg:table-cell">Objectif</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Programme</th>
                <th className="text-left p-4 font-medium text-gray-500">Progression</th>
                <th className="text-left p-4 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                  <tr
                    key={client.id}
                    className={index < filteredClients.length - 1 ? "border-b hover:bg-gray-50" : "hover:bg-gray-50"}
                  >
                    <td className="p-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#21D0B2]/20 flex items-center justify-center mr-3">
                        <UserRound className="h-4 w-4 text-[#21D0B2]" />
                      </div>
                      {client.name}
                    </td>
                    <td className="p-4 hidden md:table-cell">{client.email}</td>
                    <td className="p-4 hidden lg:table-cell">{client.goal}</td>
                    <td className="p-4 hidden md:table-cell">{client.activeProgram}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                          <div
                            className="h-full bg-[#21D0B2] rounded-full"
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
                        className="text-[#21D0B2]"
                        onClick={() => onSelectClient(client.id)}
                      >
                        Détails
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
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
