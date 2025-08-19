import { ChevronRight } from "lucide-react"
import Link from "next/link"

import { Button } from "../../ui/button"

export default function CTASection() {
  return (
    <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-[#2F455C]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
              Prêt à atteindre tes objectifs ?
            </h2>
            <p className="text-white/80 text-base sm:text-lg md:text-xl/relaxed">
              Choisis la méthode qui te correspond :
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="#programmes">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#21D0B2] text-[#2F455C] font-semibold hover:bg-[#1DCFE0]"
              >
                Découvrir les programmes <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="#coaching">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#E2F163] text-[#2F455C] font-semibold hover:bg-[#d8e859]"
              >
                Trouver mon coach <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-white/60">Pas d'engagement, satisfait ou remboursé pendant 14 jours.</p>
        </div>
      </div>
    </section>
  )
}
