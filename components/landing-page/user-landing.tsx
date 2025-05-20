import HeroSection from "./sections/hero-section"
import ProgrammesSection from "./sections/programmes-section"
import CoachingSection from "./sections/coaching-section"
import TestimonialsSection from "./sections/testimonials-section"
import FAQSection from "./sections/faq-section"
import CTASection from "./sections/cta-section"
import FooterSection from "./sections/footer-section"
import Link from "next/link"
import { Dumbbell } from "lucide-react"
import { Button } from "../ui/button"
import { MobileMenu } from "../ui/mobile-menu"

export const UserLanding = () => {
  const navLinks = [
    { href: "#programmes", label: "Programmes" },
    { href: "#coaching", label: "Coaching" },
    { href: "#temoignages", label: "Témoignages" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#2F455C]/80 backdrop-blur supports-[backdrop-filter]:bg-[#2F455C]/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-[#21D0B2]" />
            <span className="text-xl font-bold text-white">AthleteAxis</span>
          </div>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-white hover:text-[#21D0B2]">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/connexion" className="text-sm font-medium text-white hover:underline underline-offset-4">
              Connexion
            </Link>
            <Link href="/inscription">
              <Button className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">S'inscrire</Button>
            </Link>
          </div>
          <MobileMenu links={navLinks} />
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />
        <ProgrammesSection />
        <CoachingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>

      <FooterSection />
    </div>
  )
}