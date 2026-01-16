'use client';

import { useState } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store auth token/session
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to main app
      router.push('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <div className="min-h-screen flex flex-col px-4 sm:px-6">
          {/* Header */}
          <div className="flex justify-between items-center py-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/conversion_edge_logo.png"
              alt="Conversion Edge Logo"
              className="h-10 sm:h-12"
            />

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

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full pb-16">
            <div className="w-full space-y-8">
              {/* Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-[#0080FF]" />
                  <span className="text-xs font-medium text-[#0080FF] dark:text-blue-400">
                    AI-Powered Copywriting
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Ecom Listicle Writer
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  Sign in to start creating compelling, conversion-focused listicle content.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 mt-12">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3.5 bg-slate-900 dark:bg-slate-900 border border-slate-700 dark:border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full px-4 py-3.5 bg-slate-900 dark:bg-slate-900 border border-slate-700 dark:border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-transparent transition-all"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-950/30 border border-red-800 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all ${
                    loading
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-[#0080FF] text-white hover:bg-[#0070E0]'
                  }`}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-slate-400 dark:text-slate-500">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => {/* Handle sign up */}}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="py-8 text-center">
            <p className="text-slate-500 dark:text-slate-500">
              Built by LPG. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
