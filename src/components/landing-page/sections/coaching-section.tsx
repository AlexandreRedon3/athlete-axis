import Image from "next/image"
import Link from "next/link"
import { Button } from "../../ui/button"
import { ChevronRight, Clock, Target, Users } from "lucide-react"

export default function CoachingSection() {
  return (
    <section
      id="coaching"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#1DCFE0] via-[#2DF3C0] to-[#2F455C] overflow-hidden"
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4 max-w-full">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-[#2F455C] px-3 py-1 text-sm text-white">
                Coaching Personnalisé
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                Un accompagnement sur mesure
              </h2>
              <p className="text-white/80 text-base sm:text-lg md:text-xl">
                Nos coachs professionnels vous accompagnent pour atteindre vos objectifs, quels qu'ils soient.
              </p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="mr-3 flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#E2F163] text-[#2F455C]">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white break-words">Coaching individuel</h3>
                  <p className="text-white/80 break-words">Un suivi personnalisé adapté à vos besoins spécifiques.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#E2F163] text-[#2F455C]">
                  <Target className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white break-words">Objectifs clairs</h3>
                  <p className="text-white/80 break-words">
                    Définition d'objectifs réalistes et d'un plan pour les atteindre.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#E2F163] text-[#2F455C]">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white break-words">Suivi régulier</h3>
                  <p className="text-white/80 break-words">
                    Feedback constant et ajustements en fonction de vos progrès.
                  </p>
                </div>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/coaching">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#2F455C] text-white border border-white hover:bg-[#1a2e3d]"
                >
                  Trouver mon coach <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8 lg:mt-0">
            <Image
              src="/personal-trainer-with-client.png"
              width={550}
              height={550}
              alt="Coach sportif avec un client"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
