import { Dumbbell, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import React from 'react';

export default function FooterSection() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#1e2c3d] text-white">
      <div className="container flex flex-col gap-8 py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-[#21D0B2]" />
              <span className="text-xl font-bold">AthleteAxis</span>
            </div>
            <p className="text-sm text-white/70">Transformez votre entraînement, atteignez vos objectifs.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Programmes</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/programmes/debutant" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Débutant
              </Link>
              <Link href="/programmes/intermediaire" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Intermédiaire
              </Link>
              <Link href="/programmes/avance" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Avancé
              </Link>
              <Link href="/programmes" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Tous les programmes
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Coaching</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/coaching/coachs" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Nos coachs
              </Link>
              <Link href="/coaching/fonctionnement" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Comment ça marche
              </Link>
              <Link href="/coaching/tarifs" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Tarifs
              </Link>
              <Link href="/coaching/reservation" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Réserver une séance
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2 md:col-span-1">
            <h3 className="text-lg font-medium">Entreprise</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/a-propos" className="text-sm text-white/70 hover:text-[#21D0B2]">
                À propos
              </Link>
              <Link href="/blog" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Blog
              </Link>
              <Link href="/carrieres" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Carrières
              </Link>
              <Link href="/contact" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2 md:col-span-1">
            <h3 className="text-lg font-medium">Légal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/conditions" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Conditions
              </Link>
              <Link href="/confidentialite" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Confidentialité
              </Link>
              <Link href="/cookies" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Cookies
              </Link>
              <Link href="/mentions-legales" className="text-sm text-white/70 hover:text-[#21D0B2]">
                Mentions légales
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/70">&copy; {new Date().getFullYear()} AthleteAxis. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link
              href="https://twitter.com"
              className="text-white/70 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://facebook.com"
              className="text-white/70 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://instagram.com"
              className="text-white/70 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://linkedin.com"
              className="text-white/70 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
