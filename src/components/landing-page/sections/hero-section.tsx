import { ChevronRight } from "lucide-react"
import Link from "next/link"

import { Button } from "../../ui/button"

export default function HeroSection() {
  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-[#1DCFE0] via-[#2DF3C0] to-[#2F455C] text-white">
      <div className="container px-4 sm:px-6 text-center max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md">
          Un nouveau souffle pour ton entraînement
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/80">
          Atteins tes objectifs avec un programme adapté ou un coaching personnalisé.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="#programmes">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-[#2F455C] font-semibold hover:bg-gray-100 transition-colors"
            >
              Découvrir les programmes <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Link href="#coaching">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#2F455C] text-white border border-white hover:bg-[#1a2e3d] transition-colors"
            >
              Trouver mon coach <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
