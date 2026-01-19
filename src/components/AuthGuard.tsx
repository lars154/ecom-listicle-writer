'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      // Check if user is authenticated
      const authenticated = isAuthenticated();

      // If not authenticated and not on login page, redirect to login
      if (!authenticated && pathname !== '/login') {
        router.push('/login');
        setShouldRender(false);
      } else if (authenticated && pathname === '/login') {
        // If authenticated and on login page, redirect to home
        router.push('/');
        setShouldRender(false);
      } else {
        setShouldRender(true);
      }
    } catch (error) {
      console.error('Auth guard error:', error);
      setShouldRender(true);
    } finally {
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0080FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render children during redirect
  if (!shouldRender) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0080FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
