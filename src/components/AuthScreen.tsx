'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Moon, Sun } from 'lucide-react';

type AuthMode = 'google' | 'email';
type EmailMode = 'signin' | 'signup';

export function AuthScreen() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('google');
  const [emailMode, setEmailMode] = useState<EmailMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (emailMode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
        setError('Check your email to confirm your account.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4 transition-colors duration-200">
        <div className="w-full max-w-md">
          <div className="text-center space-y-8">
            <div className="flex justify-between items-center mb-8 sm:mb-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/conversion_edge_logo.png"
                alt="Conversion Edge Logo"
                className="h-10 sm:h-12"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#0080FF]" />
                <span className="text-xs font-medium text-[#0080FF] dark:text-blue-400">AI-Powered Copywriting</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                Ecom Listicle Writer
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Sign in to start creating compelling, conversion-focused listicle content.
              </p>
            </div>

            {error && (
              <div className={`${error.includes('Check your email') ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'} border rounded-lg p-4`}>
                <p className={`text-sm ${error.includes('Check your email') ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>{error}</p>
              </div>
            )}

            <div className="space-y-4 pt-4">
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setAuthMode('google')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    authMode === 'google'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Google
                </button>
                <button
                  onClick={() => setAuthMode('email')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    authMode === 'email'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Email
                </button>
              </div>

              {authMode === 'google' ? (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-500 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-transparent"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-500 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-transparent"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#0080FF] hover:bg-blue-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {emailMode === 'signin' ? 'Signing in...' : 'Creating account...'}
                        </div>
                      ) : (
                        emailMode === 'signin' ? 'Sign In' : 'Create Account'
                      )}
                    </button>
                  </form>

                  <div className="text-center">
                    <button
                      onClick={() => {
                        setEmailMode(emailMode === 'signin' ? 'signup' : 'signin');
                        setError(null);
                      }}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {emailMode === 'signin'
                        ? "Don't have an account? Sign up"
                        : 'Already have an account? Sign in'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8">
              <p className="text-xs text-center text-slate-500">
                Built by LPG. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
