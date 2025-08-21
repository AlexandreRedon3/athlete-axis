"use client"
import { Menu, X } from 'lucide-react'
import Link from "next/link"
import React from 'react';
import { useState } from "react"

import { Button } from "./button"

interface MobileMenuProps {
  links: {
    href: string
    label: string
  }[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="text-white"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={toggleMenu}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#2F455C]/95 backdrop-blur-sm">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">AthleteAxis</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              aria-label="Fermer le menu"
              onClick={toggleMenu}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="container mt-8 flex flex-col gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xl font-medium text-white hover:text-[#21D0B2] transition-colors"
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="#"
                className="text-center text-lg font-medium text-white hover:underline underline-offset-4"
                onClick={toggleMenu}
              >
                Connexion
              </Link>
              <Button
                className="w-full bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]"
                onClick={toggleMenu}
              >
                S'inscrire
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
