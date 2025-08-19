"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

interface FAQItem {
  question: string
  answer: string
}

export default function FAQSection() {
  const faqs: FAQItem[] = [
    {
      question: "Comment se passent les séances avec un coach ?",
      answer:
        "Après un entretien initial pour définir vos objectifs et évaluer votre niveau, votre coach vous propose un programme personnalisé. Les séances peuvent se dérouler en présentiel ou à distance selon vos préférences. Vous bénéficiez d'un suivi régulier et d'ajustements au fil de votre progression.",
    },
    {
      question: "Puis-je commencer si je suis débutant ?",
      answer:
        "Absolument ! Nos programmes sont adaptés à tous les niveaux, y compris les débutants complets. Les exercices commencent doucement et progressent à votre rythme pour vous permettre d'acquérir les bases tout en évitant les blessures. Vous serez guidé étape par étape dans votre parcours sportif.",
    },
    {
      question: "Les programmes sont-ils accessibles à vie ?",
      answer:
        "Oui, une fois un programme acheté, vous y avez accès à vie. Vous pouvez le suivre à votre rythme, le reprendre quand vous le souhaitez, et vous aurez également accès aux futures mises à jour de ce programme sans frais supplémentaires.",
    },
    {
      question: "Combien de temps faut-il pour voir des résultats ?",
      answer:
        "Les résultats varient selon les individus, vos objectifs et votre assiduité. Toutefois, la plupart de nos utilisateurs constatent des améliorations dès les 3-4 premières semaines d'entraînement régulier. Pour des transformations plus significatives, comptez 2 à 3 mois de pratique constante.",
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#1DCFE0] via-[#2DF3C0] to-[#2F455C]"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#2F455C] px-3 py-1 text-sm text-white">FAQ</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
              Questions fréquentes
            </h2>
            <p className="text-white/80 text-base sm:text-lg md:text-xl/relaxed">
              Tout ce que vous devez savoir pour commencer.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-3xl gap-4 py-8 sm:py-12">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white cursor-pointer transition-all duration-200 hover:bg-white/15"
              onClick={() => toggleFAQ(index)}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">{faq.question}</CardTitle>
                <div className="text-white">
                  {openIndex === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardHeader>
              {openIndex === index && (
                <CardContent>
                  <p className="text-white/80">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
