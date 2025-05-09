"use client"

import { Button } from "@heroui/button"
import { Card } from "@heroui/card"
import Image from "next/image"
import Link from "next/link"

export const ProLanding = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header avec bouton retour */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/dashboard" className="flex items-center text-yellow-400">
          <span className="mr-2">◀</span> Retour
        </Link>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto flex-1 px-4 py-6">
        <div className="mb-12 text-center md:text-left">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Espace Professionnel
          </h1>
          <p className="text-gray-400">
            Gérez vos clients et programmes d'entraînement
          </p>
        </div>

        {/* Cartes d'options */}
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap">
          {/* Carte 1: Gestion des clients */}
          <Card className="w-full overflow-hidden rounded-xl bg-blue-900 md:w-[48%]">
            <div className="p-6">
              <h2 className="mb-4 text-center text-xl font-semibold">
                Gestion des clients
              </h2>
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={"/images/client-management.jpg" ? "/images/client-management.jpg" : "https://heroui.com/images/hero-card-complete.jpeg"}
                  alt="Gestion des clients"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm">
                  Suivez les progrès de vos clients et gérez leurs programmes personnalisés.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Button color="primary" className="w-full">
                Accéder
              </Button>
            </div>
          </Card>

          {/* Carte 2: Création de programmes */}
          <Card className="w-full overflow-hidden rounded-xl bg-purple-900 md:w-[48%]">
            <div className="p-6">
              <h2 className="mb-4 text-center text-xl font-semibold">
                Création de programmes
              </h2>
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={"/images/program-creation.jpg" ? "/images/program-creation.jpg" : "https://heroui.com/images/hero-card-complete.jpeg"}
                  alt="Création de programmes"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm">
                  Créez et personnalisez des programmes d'entraînement adaptés aux besoins de vos clients.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Button color="secondary" className="w-full">
                Commencer
              </Button>
            </div>
          </Card>
          
          {/* Carte 3: Statistiques */}
          <Card className="w-full overflow-hidden rounded-xl bg-green-900 md:w-[48%]">
            <div className="p-6">
              <h2 className="mb-4 text-center text-xl font-semibold">
                Statistiques
              </h2>
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={"/images/statistics.jpg" ? "/images/statistics.jpg" : "https://heroui.com/images/hero-card-complete.jpeg"}
                  alt="Statistiques"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm">
                  Analysez les performances et suivez les progrès avec des graphiques détaillés.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Button color="success" className="w-full">
                Voir les stats
              </Button>
            </div>
          </Card>
          
          {/* Carte 4: Paramètres */}
          <Card className="w-full overflow-hidden rounded-xl bg-gray-800 md:w-[48%]">
            <div className="p-6">
              <h2 className="mb-4 text-center text-xl font-semibold">
                Paramètres du compte
              </h2>
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src="/images/account-settings.jpg"
                  alt="Paramètres du compte"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm">
                  Gérez votre profil, vos préférences et vos informations professionnelles.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Button color="default" className="w-full">
                Configurer
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
