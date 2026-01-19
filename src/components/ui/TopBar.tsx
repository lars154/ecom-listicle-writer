import { ReactNode } from 'react';
import { Button } from './Button';

interface TopBarProps {
  logo?: ReactNode;
  navLinks?: Array<{ label: string; href: string }>;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function TopBar({ logo, navLinks, ctaLabel = 'Get Started', onCtaClick }: TopBarProps) {
  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {logo || (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-[#3B82F6] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
            )}
          </div>

          {/* Nav Links */}
          {navLinks && navLinks.length > 0 && (
            <nav className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-muted hover:text-text transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* CTA */}
          <div>
            <Button variant="primary" size="md" onClick={onCtaClick}>
              {ctaLabel}
              <svg className="w-4 h-4 ml-1.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

