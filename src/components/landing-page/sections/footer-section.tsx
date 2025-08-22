import { Dumbbell, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
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
              <span className="text-sm text-white/40 cursor-not-allowed">
                Débutant
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Intermédiaire
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Avancé
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Tous les programmes
              </span>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Coaching</h3>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-white/40 cursor-not-allowed">
                Nos coachs
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Comment ça marche
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Tarifs
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Réserver une séance
              </span>
            </nav>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2 md:col-span-1">
            <h3 className="text-lg font-medium">Entreprise</h3>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-white/40 cursor-not-allowed">
                À propos
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Blog
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Carrières
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Contact
              </span>
            </nav>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2 md:col-span-1">
            <h3 className="text-lg font-medium">Légal</h3>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-white/40 cursor-not-allowed">
                Conditions
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Confidentialité
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Cookies
              </span>
              <span className="text-sm text-white/40 cursor-not-allowed">
                Mentions légales
              </span>
            </nav>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/70">&copy; {new Date().getFullYear()} AthleteAxis. Tous droits réservés.</p>
          <div className="flex gap-4">
            <span className="text-white/40 cursor-not-allowed">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </span>
            <span className="text-white/40 cursor-not-allowed">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </span>
            <span className="text-white/40 cursor-not-allowed">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </span>
            <span className="text-white/40 cursor-not-allowed">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
