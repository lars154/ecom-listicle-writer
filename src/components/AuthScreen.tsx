'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Moon, Sun } from 'lucide-react';

type EmailMode = 'signin' | 'signup';

export function AuthScreen() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
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

          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md text-center space-y-8">
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

              <div className="pt-8">
                <p className="text-xs text-center text-slate-500">
                  Built by LPG. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
