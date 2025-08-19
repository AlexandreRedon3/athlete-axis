import { Check, Dumbbell, Target, Zap } from "lucide-react"
import Link from "next/link"

import { Button } from "../../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card"

export default function ProgrammesSection() {
  return (
    <section id="programmes" className="w-full py-12 md:py-24 lg:py-32 bg-[#2F455C]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#21D0B2] px-3 py-1 text-sm text-[#2F455C]">Nos Programmes</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
              Des programmes adaptés à tous les niveaux
            </h2>
            <p className="max-w-[900px] text-white/80 text-base sm:text-lg md:text-xl/relaxed">
              Que vous soyez débutant ou athlète confirmé, nous avons le programme qu'il vous faut.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-8 sm:py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {/* Programme Card 1 */}
          <Card className="bg-white/10 border-[#21D0B2]/20 text-white">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#21D0B2] text-[#2F455C] mb-3">
                <Target className="h-5 w-5" />
              </div>
              <CardTitle>Débutant</CardTitle>
              <CardDescription className="text-white/70">Idéal pour commencer en douceur</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#21D0B2]" />
                  <span>Exercices adaptés aux débutants</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#21D0B2]" />
                  <span>Progression graduelle</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#21D0B2]" />
                  <span>Vidéos explicatives détaillées</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#21D0B2]" />
                  <span>Suivi de progression</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/programmes/debutant" className="w-full">
                <Button className="w-full bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">Commencer</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Programme Card 2 */}
          <Card className="bg-white/10 border-[#E2F163]/20 text-white relative">
            <div className="absolute top-4 right-4 bg-[#E2F163] text-[#2F455C] px-3 py-1 rounded-full text-xs font-semibold">
              Populaire
            </div>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E2F163] text-[#2F455C] mb-3">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle>Intermédiaire</CardTitle>
              <CardDescription className="text-white/70">Pour ceux qui veulent progresser</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#E2F163]" />
                  <span>Exercices plus intenses</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#E2F163]" />
                  <span>Programmes variés</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#E2F163]" />
                  <span>Conseils nutritionnels</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#E2F163]" />
                  <span>Accès à la communauté</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/programmes/intermediaire" className="w-full">
                <Button className="w-full bg-[#E2F163] text-[#2F455C] hover:bg-[#d8e859]">Commencer</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Programme Card 3 */}
          <Card className="bg-white/10 border-[#21D0B2]/20 text-white md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#21D0B2] text-[#2F455C] mb-3">
                <Dumbbell className="h-5 w-5" />
              </div>
              <CardTitle>Avancé</CardTitle>
              <CardDescription className="text-white/70">Pour les athlètes expérimentés</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#21D0B2]" />
                  <span>Entraînements haute intensité</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#21D0B2]" />
                  <span>Techniques avancées</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#21D0B2]" />
                  <span>Plans périodisés</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#21D0B2]" />
                  <span>Suivi des performances</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/programmes/avance" className="w-full">
                <Button className="w-full bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">Commencer</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
