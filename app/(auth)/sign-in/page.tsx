'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authClient.signIn.email({
        email,
        password,
      }, {
        onSuccess: () => {
          router.push('/dashboard');
        },
        onError: (err) => {
          setError(err.error.message || 'Échec de la connexion');
          setLoading(false);
        }
      });
    } catch (err) {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {

    setSocialLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: "/dashboard"
      });
      // La redirection est gérée par le SDK de Better Auth
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion avec Google');
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
            <h2 className="text-3xl font-bold text-gray-800">Connexion</h2>
            <p className="text-gray-600 mt-2">Accédez à votre espace personnel</p>
          </div>
          
          {/* Bouton Google */}
          <div className="mb-6">
            <button
              onClick={handleGoogleSignIn}
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
              {socialLoading ? 'Connexion en cours...' : 'Continuer avec Google'}
            </button>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
            </div>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="votre@email.com"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Mot de passe oublié?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
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
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Pas encore inscrit ?{' '}
              <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}