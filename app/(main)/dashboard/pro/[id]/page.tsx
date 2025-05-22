import { Button } from "../../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Dumbbell, User, Users, Calendar, Activity, Clock, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"

export default function CoachDashboard() {
  return (
    <div className="min-h-screen bg-[#2F455C]/5">
      
      <main className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2F455C]">Bienvenue, Coach</h1>
            <p className="text-gray-600">Gérez vos clients et programmes</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
            <Plus className="mr-2 h-4 w-4" /> Créer un programme
          </Button>
        </div>

        {/* Résumé */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Clients actifs</CardTitle>
              <Users className="h-4 w-4 text-[#21D0B2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">+2 ce mois-ci</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Programmes créés</CardTitle>
              <Activity className="h-4 w-4 text-[#21D0B2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-500">+1 cette semaine</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Séances planifiées</CardTitle>
              <Calendar className="h-4 w-4 text-[#21D0B2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-gray-500">Pour les 7 prochains jours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Heures de coaching</CardTitle>
              <Clock className="h-4 w-4 text-[#21D0B2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32h</div>
              <p className="text-xs text-gray-500">Ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients récents */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#2F455C]">Clients récents</h2>
              <Link href="/dashboard/coach/clients">
                <Button variant="ghost" className="text-[#21D0B2] hover:text-[#1DCFE0] hover:bg-[#21D0B2]/10">
                  Voir tous <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
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
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">Sophie Martin</td>
                      <td className="p-4">Débutant</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                            <div className="h-full bg-[#21D0B2] rounded-full" style={{ width: "75%" }}></div>
                          </div>
                          <span>75%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="text-[#21D0B2]">
                          Détails
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">Thomas Dubois</td>
                      <td className="p-4">Intermédiaire</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                            <div className="h-full bg-[#21D0B2] rounded-full" style={{ width: "45%" }}></div>
                          </div>
                          <span>45%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="text-[#21D0B2]">
                          Détails
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">Julie Petit</td>
                      <td className="p-4">Avancé</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                            <div className="h-full bg-[#21D0B2] rounded-full" style={{ width: "30%" }}></div>
                          </div>
                          <span>30%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="text-[#21D0B2]">
                          Détails
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4">Marc Leroy</td>
                      <td className="p-4">Débutant</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                            <div className="h-full bg-[#21D0B2] rounded-full" style={{ width: "15%" }}></div>
                          </div>
                          <span>15%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="text-[#21D0B2]">
                          Détails
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Calendrier */}
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-bold text-[#2F455C] mb-4">Séances à venir</h2>
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
      </main>
    </div>
  )
}
