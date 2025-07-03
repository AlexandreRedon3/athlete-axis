import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"

export default function TestimonialsSection() {
  return (
    <section id="temoignages" className="w-full py-12 md:py-24 lg:py-32 bg-[#2F455C]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#21D0B2] px-3 py-1 text-sm text-[#2F455C]">Témoignages</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
              Ils ont transformé leur entraînement
            </h2>
            <p className="text-white/80 text-base sm:text-lg md:text-xl/relaxed">
              Découvrez les expériences de nos membres satisfaits.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-8 sm:py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#21D0B2] flex items-center justify-center text-[#2F455C] font-bold">
                  L
                </div>
                <div>
                  <CardTitle className="text-lg">Lucas, 29 ans</CardTitle>
                  <CardDescription className="text-white/70">Membre depuis 6 mois</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex text-[#E2F163] mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/80 italic">
                "Grâce au programme, j'ai repris le sport sans me blesser. Les exercices sont progressifs et vraiment
                adaptés."
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E2F163] flex items-center justify-center text-[#2F455C] font-bold">
                  C
                </div>
                <div>
                  <CardTitle className="text-lg">Clara, 35 ans</CardTitle>
                  <CardDescription className="text-white/70">Membre depuis 1 an</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex text-[#E2F163] mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/80 italic">
                "Un coaching ultra motivant. Mon coach s'adapte à tout. Même avec mon emploi du temps chargé, j'arrive à
                progresser constamment."
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#21D0B2] flex items-center justify-center text-[#2F455C] font-bold">
                  M
                </div>
                <div>
                  <CardTitle className="text-lg">Maxime, 42 ans</CardTitle>
                  <CardDescription className="text-white/70">Membre depuis 8 mois</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex text-[#E2F163] mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/80 italic">
                "J'ai perdu 8kg en suivant le programme et j'ai repris confiance en moi. La communauté est super
                motivante aussi !"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
