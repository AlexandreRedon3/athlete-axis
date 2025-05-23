import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, User, Calendar, Activity, BarChart, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client";

export default async function UserDashboard() {
  const session = await authClient.getSession()
  
  return (
    <div className="min-h-screen bg-[#2F455C]/5">
      
      <main className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2F455C]">Bienvenue, {session?.data?.user?.name}</h1>
            <p className="text-gray-600">Voici votre tableau de bord personnel</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
            Commencer un entraînement
          </Button>
        </div>

        {/* Résumé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Programmes suivis</CardTitle>
              <Activity className="h-4 w-4 text-[#21D0B2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-500">+1 cette semaine</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Séances complétées</CardTitle>
              <Calendar className="h-4 w-4 text-[#21D0B2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">+3 cette semaine</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Temps d'entraînement</CardTitle>
              <Clock className="h-4 w-4 text-[#21D0B2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8h 30m</div>
              <p className="text-xs text-gray-500">+2h cette semaine</p>
            </CardContent>
          </Card>
        </div>

        {/* Programmes */}
        <h2 className="text-xl font-bold text-[#2F455C] mb-4">Mes programmes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#1DCFE0] to-[#2DF3C0]"></div>
            <CardHeader>
              <CardTitle>Programme Débutant</CardTitle>
              <CardDescription>Progression: 45%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#21D0B2] rounded-full" style={{ width: "45%" }}></div>
              </div>
              <div className="mt-4">
                <Link href="/programmes/debutant">
                  <Button variant="outline" className="w-full">
                    Continuer <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#2DF3C0] to-[#E2F163]"></div>
            <CardHeader>
              <CardTitle>Cardio Intensif</CardTitle>
              <CardDescription>Progression: 20%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#21D0B2] rounded-full" style={{ width: "20%" }}></div>
              </div>
              <div className="mt-4">
                <Link href="/programmes/cardio">
                  <Button variant="outline" className="w-full">
                    Continuer <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#E2F163] to-[#2F455C]"></div>
            <CardHeader>
              <CardTitle>Renforcement musculaire</CardTitle>
              <CardDescription>Progression: 10%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#21D0B2] rounded-full" style={{ width: "10%" }}></div>
              </div>
              <div className="mt-4">
                <Link href="/programmes/renforcement">
                  <Button variant="outline" className="w-full">
                    Continuer <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques */}
        <h2 className="text-xl font-bold text-[#2F455C] mb-4">Mes statistiques</h2>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progression hebdomadaire</CardTitle>
            <CardDescription>Suivi de vos performances sur les 7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="flex items-center justify-center flex-col">
              <BarChart className="h-16 w-16 text-[#21D0B2] mb-4" />
              <p className="text-gray-500 text-center">
                Vos statistiques détaillées seront disponibles après plus d'entraînements
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

