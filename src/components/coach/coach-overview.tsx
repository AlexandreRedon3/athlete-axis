import { StatsCard } from "@/components/dashboard/stats-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Activity, Calendar, Clock, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import router from "next/router"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateProgramForm } from "./training/create-program-form"

export function CoachOverview() {

  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false)

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Vue d'ensemble"
        description="Votre tableau de bord de coaching"
        buttonText="Créer un programme"
        buttonIcon={Plus}
        onButtonClick={() => {
          setIsCreateProgramOpen(true)

        }}
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Clients actifs" value={12} description="+2 ce mois-ci" icon={Users} />
        <StatsCard title="Programmes créés" value={8} description="+1 cette semaine" icon={Activity} />
        <StatsCard title="Séances planifiées" value={24} description="Pour les 7 prochains jours" icon={Calendar} />
        <StatsCard title="Heures de coaching" value="32h" description="Ce mois-ci" icon={Clock} />
      </div>

      {/* Clients récents et Calendrier */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#2F455C]">Clients récents</h3>
            <Button variant="ghost" className="text-[#21D0B2] hover:text-[#1DCFE0] hover:bg-[#21D0B2]/10">
              Voir tous <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-500">Nom</th>
                    <th className="text-left p-4 font-medium text-gray-500">Programme</th>
                    <th className="text-left p-4 font-medium text-gray-500">Progression</th>
                    <th className="text-left p-4 font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Sophie Martin", program: "Débutant", progress: 75 },
                    { name: "Thomas Dubois", program: "Intermédiaire", progress: 45 },
                    { name: "Julie Petit", program: "Avancé", progress: 30 },
                    { name: "Marc Leroy", program: "Débutant", progress: 15 },
                  ].map((client, index) => (
                    <tr key={index} className={index < 3 ? "border-b hover:bg-gray-50" : "hover:bg-gray-50"}>
                      <td className="p-4">{client.name}</td>
                      <td className="p-4">{client.program}</td>
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
                          Détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isCreateProgramOpen} onOpenChange={setIsCreateProgramOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau programme</DialogTitle>
            </DialogHeader>
            <CreateProgramForm
              onSubmit={(data) => {
                console.log("Nouveau programme:", data)
                setIsCreateProgramOpen(false)
                // Ici, vous ajouteriez le programme à votre base de données
              }}
            />
          </DialogContent>
        </Dialog>

        <div className="w-full md:w-1/3">
          <h3 className="text-lg font-bold text-[#2F455C] mb-4">Séances à venir</h3>
          <Card>
            <CardHeader>
              <CardTitle>Aujourd'hui</CardTitle>
              <CardDescription>Mardi, 20 Mai 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#21D0B2]/10 p-3 rounded-lg border border-[#21D0B2]/20">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Sophie Martin</p>
                  <span className="text-sm text-gray-500">10:00 - 11:00</span>
                </div>
                <p className="text-sm text-gray-600">Séance de renforcement</p>
              </div>
              <div className="bg-[#21D0B2]/10 p-3 rounded-lg border border-[#21D0B2]/20">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Thomas Dubois</p>
                  <span className="text-sm text-gray-500">14:30 - 15:30</span>
                </div>
                <p className="text-sm text-gray-600">Cardio intensif</p>
              </div>
              <div className="mt-4">
                <Link href="/dashboard/coach/calendar">
                  <Button variant="outline" className="w-full">
                    Voir le calendrier complet
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
