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
            <h3 className="text-lg font-bold text-foreground transition-colors duration-200">Clients récents</h3>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors duration-200"
            >
              Voir tous <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <Card className="border-border/50 shadow-sm transition-colors duration-200">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-medium text-muted-foreground transition-colors duration-200">Nom</th>
                    <th className="text-left p-4 font-medium text-muted-foreground transition-colors duration-200">Programme</th>
                    <th className="text-left p-4 font-medium text-muted-foreground transition-colors duration-200">Progression</th>
                    <th className="text-left p-4 font-medium text-muted-foreground transition-colors duration-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Sophie Martin", program: "Débutant", progress: 75 },
                    { name: "Thomas Dubois", program: "Intermédiaire", progress: 45 },
                    { name: "Julie Petit", program: "Avancé", progress: 30 },
                    { name: "Marc Leroy", program: "Débutant", progress: 15 },
                  ].map((client, index) => (
                    <tr 
                      key={index} 
                      className={`${
                        index < 3 ? "border-b border-border/30" : ""
                      } hover:bg-accent/50 transition-colors duration-200`}
                    >
                      <td className="p-4 text-foreground dark:text-foreground transition-colors duration-200">{client.name}</td>
                      <td className="p-4 text-foreground transition-colors duration-200">{client.program}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mr-2">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${client.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-foreground transition-colors duration-200">{client.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors duration-200"
                        >
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
          <DialogContent className="sm:max-w-[600px] bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Créer un nouveau programme</DialogTitle>
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

        {/* Séances à venir */}
        {/* TODO: Implémenter la logique avec Calendly */}

        <div className="w-full md:w-1/3">
          <h3 className="text-lg font-bold text-foreground mb-4 transition-colors duration-200">Séances à venir</h3>
          <Card className="border-border/50 shadow-sm transition-colors duration-200">
            <CardHeader>
              <CardTitle className="text-foreground transition-colors duration-200">Aujourd'hui</CardTitle>
              <CardDescription className="text-muted-foreground transition-colors duration-200">Mardi, 20 Mai 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 transition-colors duration-200">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-foreground transition-colors duration-200">Sophie Martin</p>
                  <span className="text-sm text-muted-foreground transition-colors duration-200">10:00 - 11:00</span>
                </div>
                <p className="text-sm text-muted-foreground transition-colors duration-200">Séance de renforcement</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 transition-colors duration-200">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-foreground transition-colors duration-200">Thomas Dubois</p>
                  <span className="text-sm text-muted-foreground transition-colors duration-200">14:30 - 15:30</span>
                </div>
                <p className="text-sm text-muted-foreground transition-colors duration-200">Cardio intensif</p>
              </div>
              <div className="mt-4">
                <Link href="/dashboard/coach/calendar">
                  <Button 
                    variant="outline" 
                    className="w-full border-border dark:text-foreground text-foreground hover:bg-accent transition-colors duration-200"
                  >
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
