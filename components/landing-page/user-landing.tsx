"use client"

import { Button } from "@heroui/button"
import { Card } from "@heroui/card"
import Image from "next/image"
import Link from "next/link"

export const UserLanding = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header avec bouton retour */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/back" className="flex items-center text-yellow-400">
          <span className="mr-2">◀</span> Retour
        </Link>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto flex-1 px-4 py-6">
        <div className="mb-12 text-center md:text-left">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Choisis ton plan d'entraînement
          </h1>
        </div>

        {/* Cartes d'options */}
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap">
          {/* Carte 1: Programmes prédéfinis */}
          <Card className="w-full overflow-hidden rounded-xl bg-teal-900 md:w-[48%]">
            <div className="p-6">
              <h2 className="mb-4 text-center text-xl font-semibold">
                Programmes prédéfinis
              </h2>
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={"/images/predefined-programs.jpg" ? "/images/predefined-programs.jpg" : "https://heroui.com/images/hero-card-complete.jpeg"}
                  alt="Programmes prédéfinis"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm">
                  <span className="font-bold">Accès immédiat</span> à des
                  programmes prêts à l'emploi pour
                  <span className="font-bold"> débutants à experts</span>.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Button color="primary" className="w-full">
                Découvrir
              </Button>
            </div>
          </Card>

          {/* Carte 2: Accompagnement personnalisé */}
          <Card className="w-full overflow-hidden rounded-xl bg-gray-700 md:w-[48%]">
            <div className="p-6">
              <h2 className="mb-4 text-center text-xl font-semibold">
                Accompagnement personnalisé
              </h2>
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={"/images/personal-coaching.jpg" ? "/images/personal-coaching.jpg" : "https://heroui.com/images/hero-card-complete.jpeg"}
                  alt="Accompagnement personnalisé"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm">
                  Un suivi <span className="font-bold">sur mesure</span> avec un{" "}
                  <span className="font-bold">coach</span> afin de vous permettre
                  d'atteindre vos <span className="font-bold">objectifs</span>.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Button color="secondary" className="w-full">
                En savoir plus
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
