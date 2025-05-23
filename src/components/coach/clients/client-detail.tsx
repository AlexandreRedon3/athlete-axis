"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Calendar, Target, Weight, Ruler, Mail, Phone } from "lucide-react"
import { ClientProgramHistory } from "@/components/coach/clients/client-program-history"
import { ClientNutritionHistory } from "@/components/coach/clients/client-nutrition-history"

interface ClientDetailProps {
  client: {
    id: string
    name: string
    age: number
    goal: string
    weight: number
    height: number
    email: string
    phone: string
    joinedDate: string
    activeProgram: string
    programProgress: number
  }
  onBack: () => void
}

export function ClientDetail({ client, onBack }: ClientDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold text-[#2F455C]">Fiche client</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#21D0B2]" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-[#21D0B2]/20 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-[#21D0B2]" />
              </div>
              <h3 className="text-xl font-bold">{client.name}</h3>
              <p className="text-gray-500">Client depuis {new Date(client.joinedDate).toLocaleDateString()}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <Target className="h-5 w-5 text-[#21D0B2] mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Objectif</p>
                  <p className="font-medium">{client.goal}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-[#21D0B2] mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Âge</p>
                  <p className="font-medium">{client.age} ans</p>
                </div>
              </div>
              <div className="flex items-start">
                <Weight className="h-5 w-5 text-[#21D0B2] mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Poids</p>
                  <p className="font-medium">{client.weight} kg</p>
                </div>
              </div>
              <div className="flex items-start">
                <Ruler className="h-5 w-5 text-[#21D0B2] mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Taille</p>
                  <p className="font-medium">{client.height} cm</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-[#21D0B2] mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-[#21D0B2] mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
                Modifier les informations
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <Tabs defaultValue="programs" className="w-full">
              <TabsList className="w-full grid grid-cols-2 rounded-none">
                <TabsTrigger value="programs">Programmes</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              </TabsList>
              <TabsContent value="programs" className="p-6">
                <ClientProgramHistory clientId={client.id} />
              </TabsContent>
              <TabsContent value="nutrition" className="p-6">
                <ClientNutritionHistory clientId={client.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
