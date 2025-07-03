"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dumbbell, Loader2, ChevronRight, AlertCircle } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function SignUpPage() {
  const router = useRouter()
  const params = useParams()
  const inviteToken = params.token as string
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [tokenLoading, setTokenLoading] = useState(true)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Vérifier la validité du token d'invitation
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/invites/validate?token=${inviteToken}`)
        if (response.ok) {
          setTokenValid(true)
        } else {
          setTokenValid(false)
        }
      } catch (error) {
        setTokenValid(false)
      } finally {
        setTokenLoading(false)
      }
    }

    if (inviteToken) {
      validateToken()
    }
  }, [inviteToken])

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register-with-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          inviteToken: inviteToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de l'inscription");
      }

      toast.success("Compte créé avec succès !")
      router.push('/sign-in');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Afficher un loader pendant la validation du token
  if (tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Vérification de l'invitation...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur si le token est invalide
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitation invalide</h1>
          <p className="text-gray-600 mb-6">
            Cette invitation n'est plus valide ou a expiré.
          </p>
          <Link href="/">
            <Button className="w-full">
              Retour à l'accueil
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar gauche - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#21D0B2] to-[#1DCFE0] items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-2 mb-8">
            <Dumbbell className="h-8 w-8" />
            <h1 className="text-4xl font-bold">AthleteAxis</h1>
          </div>
          <h2 className="text-3xl font-bold mb-6">Rejoignez votre coach</h2>
          <p className="text-xl mb-8 opacity-90">
            Créez votre compte pour accéder à vos programmes d'entraînement personnalisés
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>Programmes d'entraînement sur mesure</p>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>Suivi de vos progrès en temps réel</p>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>Communication directe avec votre coach</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire - Mobile et Desktop */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-[#2F455C]/5">
        <Card className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl border-0">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <Dumbbell className="h-7 w-7 text-[#21D0B2]" />
              <h1 className="text-3xl font-bold text-[#2F455C]">AthleteAxis</h1>
            </div>
            <h2 className="text-2xl font-bold text-[#2F455C]">Créez votre compte</h2>
            <p className="text-gray-600 mt-2">Rejoignez votre coach sur AthleteAxis</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#21D0B2] focus:border-transparent transition-all"
                placeholder="Votre nom"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#21D0B2] focus:border-transparent transition-all"
                placeholder="votre@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#21D0B2] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#21D0B2] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

            <Button
              type="submit"
              className="w-full py-6 bg-[#21D0B2] hover:bg-[#1DCFE0] text-[#2F455C] font-semibold rounded-lg transition-colors"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Inscription en cours..." : "S'inscrire"}
              {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link href="/sign-in" className="text-[#21D0B2] hover:text-[#1DCFE0] font-medium">
                Connectez-vous
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
