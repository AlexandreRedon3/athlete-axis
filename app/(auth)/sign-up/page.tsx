'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import Link from 'next/link';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          username: data.name,
          image: "",
          isPro: false,
          onBoardingComplete: false,
        },
        {
          onSuccess: () => {
            router.push('/dashboard');
          },
          onError: (err) => {
            setError(err.error.message || 'Échec de l\'inscription');
            setLoading(false);
          }
        },
      );
    } catch (err) {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setSocialLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: "/dashboard"
      });
      // La redirection est gérée par le SDK de Better Auth
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription avec Google');
      setSocialLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 items-center justify-center">
        <div className="max-w-md text-white p-12">
          <h1 className="text-4xl font-bold mb-6">Athlete Axis</h1>
          <p className="text-xl mb-8">
            Plateforme dédiée aux athlètes et coachs pour optimiser leurs performances
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>Programmes d'entraînement personnalisés</p>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>Suivi des performances en temps réel</p>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>Communauté d'athlètes et de coachs</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Inscription</h2>
            <p className="text-gray-600 mt-2">Rejoignez notre communauté</p>
          </div>
          
          {/* Bouton Google */}
          <div className="mb-6">
            <button
              onClick={handleGoogleSignUp}
              disabled={socialLoading}
              className="w-full py-3 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center justify-center shadow-sm"
            >
              {socialLoading ? <span className="mr-2 animate-spin">⟳</span> : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M12 4.68C14.97 4.68 16.94 6 18 7.73l3.36-3.36C19.59 2.07 16.07 0 12 0 7.38 0 3.36 2.72 1.34 6.63l3.92 3.12C6.49 6.73 9.02 4.68 12 4.68z"
                  />
                  <path
                    fill="#34A853"
                    d="M23.65 12.18c0-.9-.09-1.54-.25-2.18H12v4.36h6.64c-.15 1.29-1.09 3.23-3.14 4.54l3.85 3.01c2.34-2.19 3.65-5.38 3.65-9.73z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.26 14.45c-.36-1.08-.57-2.24-.57-3.45 0-1.21.21-2.37.57-3.45L1.34 4.43C.48 6.73 0 9.3 0 12c0 2.7.48 5.27 1.34 7.57l3.92-3.12z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 19.32c2.95 0 5.48-1.05 7.35-3.05l-3.85-3.01c-1.05.72-2.45 1.24-3.5 1.24-3.01 0-5.54-2.05-6.45-4.73L1.63 12.9c2.03 3.91 6.05 6.42 10.37 6.42z"
                  />
                </svg>
              )}
              {socialLoading ? 'Inscription en cours...' : 'S\'inscrire avec Google'}
            </button>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou par email</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Votre nom"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              {loading ? <Spinner className="mr-2" /> : null}
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
          </form>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}