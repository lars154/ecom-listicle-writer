'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  EmptyState,
  FeatureItem,
  Input,
  SectionHeader,
  Spinner,
  Toast,
  TogglePill,
  TopBar,
} from '@/components/ui';

export default function DesignSystemShowcase() {
  const [selectedPills, setSelectedPills] = useState<Set<number>>(new Set([0]));
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'default'>('success');
  const [darkMode, setDarkMode] = useState(false);

  const togglePill = (index: number) => {
    const newSelected = new Set(selectedPills);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedPills(newSelected);
  };

  const handleToastDemo = (variant: 'success' | 'error' | 'default') => {
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative gradient blob */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-accent/20 via-[#8B5CF6]/15 to-transparent blur-3xl opacity-50 pointer-events-none" />

      {/* Top Bar */}
      <TopBar
        navLinks={[
          { label: 'Components', href: '#components' },
          { label: 'Typography', href: '#typography' },
          { label: 'Colors', href: '#colors' },
        ]}
        ctaLabel="View Docs"
        onCtaClick={() => alert('Documentation clicked!')}
      />

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-24 text-center relative">
          <Chip variant="accent">Design System v1.0</Chip>
          <h1 className="text-[44px] font-extrabold leading-tight text-text mt-4 mb-4">
            Listicle Writer Design System
          </h1>
          <p className="text-lg text-text-muted max-w-[520px] mx-auto mb-8">
            A premium SaaS design system with soft shadows, gradient accents, and a
            clean, modern aesthetic. Built with Tailwind CSS and React.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="primary" onClick={() => handleToastDemo('success')}>
              Get Started
              <svg className="w-4 h-4 ml-1.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            <Button variant="secondary" onClick={toggleDarkMode}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </div>

        {/* Colors Section */}
        <section id="colors" className="mb-24">
          <SectionHeader
            chipLabel="Foundation"
            headline="Color System"
            supporting="Our color palette uses cool neutrals with indigo/lavender accents for a premium, trustworthy feel."
          />
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card padding="md">
              <div className="w-full h-16 rounded-lg bg-accent mb-3" />
              <p className="text-sm font-semibold text-text">Accent</p>
              <p className="text-xs text-text-muted">Primary actions</p>
            </Card>
            <Card padding="md">
              <div className="w-full h-16 rounded-lg bg-accent-muted mb-3" />
              <p className="text-sm font-semibold text-text">Accent Muted</p>
              <p className="text-xs text-text-muted">Highlights</p>
            </Card>
            <Card padding="md">
              <div className="w-full h-16 rounded-lg bg-success mb-3" />
              <p className="text-sm font-semibold text-text">Success</p>
              <p className="text-xs text-text-muted">Positive states</p>
            </Card>
            <Card padding="md">
              <div className="w-full h-16 rounded-lg bg-error mb-3" />
              <p className="text-sm font-semibold text-text">Error</p>
              <p className="text-xs text-text-muted">Error states</p>
            </Card>
          </div>
        </section>

        <Divider />

        {/* Typography Section */}
        <section id="typography" className="my-24">
          <SectionHeader
            chipLabel="Foundation"
            headline="Typography"
            supporting="Clear hierarchy with bold headlines and readable body text using Plus Jakarta Sans."
          />
          
          <Card padding="lg" className="mt-8 space-y-6">
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-semibold">Display / Hero</p>
              <h1 className="text-[44px] font-extrabold leading-tight text-text">
                The quick brown fox jumps over the lazy dog
              </h1>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-semibold">Heading 1</p>
              <h2 className="text-[36px] font-extrabold leading-tight text-text">
                The quick brown fox jumps over the lazy dog
              </h2>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-semibold">Heading 2</p>
              <h3 className="text-[28px] font-extrabold leading-snug text-text">
                The quick brown fox jumps over the lazy dog
              </h3>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-semibold">Heading 3</p>
              <h4 className="text-[22px] font-extrabold text-text">
                The quick brown fox jumps over the lazy dog
              </h4>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-semibold">Body Text</p>
              <p className="text-base text-text leading-normal">
                The quick brown fox jumps over the lazy dog. This is the standard body text used throughout the application for readability and clarity.
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-semibold">Body Small</p>
              <p className="text-sm text-text-muted leading-relaxed">
                The quick brown fox jumps over the lazy dog. This is smaller body text for less important information.
              </p>
            </div>
          </Card>
        </section>

        <Divider />

        {/* Buttons Section */}
        <section id="components" className="my-24">
          <SectionHeader
            chipLabel="Components"
            headline="Buttons"
            supporting="Pill-shaped buttons with gradient primary style and smooth hover effects."
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card padding="lg">
              <h3 className="text-lg font-bold text-text mb-4">Primary Buttons</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button variant="primary" size="sm">Small Button</Button>
                  <Button variant="primary" size="md">Medium Button</Button>
                  <Button variant="primary" size="lg">Large Button</Button>
                </div>
                <Button variant="primary" fullWidth>Full Width Primary</Button>
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-bold text-text mb-4">Secondary & Ghost</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="md">Secondary</Button>
                  <Button variant="ghost" size="md">Ghost</Button>
                </div>
                <Button variant="secondary" fullWidth>Full Width Secondary</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="mb-24">
          <SectionHeader
            chipLabel="Components"
            headline="Form Inputs"
            supporting="Clean inputs with subtle borders and strong focus states."
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card padding="lg">
              <Input
                label="Email Address"
                placeholder="Enter your email"
                helperText="We'll never share your email."
              />
            </Card>

            <Card padding="lg">
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error="Password must be at least 8 characters"
              />
            </Card>
          </div>
        </section>

        {/* Pills & Badges */}
        <section className="mb-24">
          <SectionHeader
            chipLabel="Components"
            headline="Pills & Badges"
            supporting="Selectable pills and status badges for categorization and labels."
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card padding="lg">
              <h3 className="text-lg font-bold text-text mb-4">Toggle Pills</h3>
              <div className="flex flex-wrap gap-2">
                {['Features', 'Benefits', 'Use Cases', 'Reviews'].map((label, index) => (
                  <TogglePill
                    key={label}
                    selected={selectedPills.has(index)}
                    onClick={() => togglePill(index)}
                  >
                    {label}
                  </TogglePill>
                ))}
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-bold text-text mb-4">Badges & Chips</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="accent">Accent</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Chip variant="accent">Featured</Chip>
                  <Chip variant="neutral">Draft</Chip>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-24">
          <SectionHeader
            chipLabel="Components"
            headline="Cards & Containers"
            supporting="Elevated surface containers with soft shadows and subtle borders."
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="md">
              <h3 className="text-lg font-bold text-text mb-2">Medium Padding</h3>
              <p className="text-sm text-text-muted">Standard card with comfortable spacing for most content.</p>
            </Card>
            <Card padding="lg">
              <h3 className="text-lg font-bold text-text mb-2">Large Padding</h3>
              <p className="text-sm text-text-muted">Extra spacing for important or featured content areas.</p>
            </Card>
            <Card padding="sm">
              <h3 className="text-lg font-bold text-text mb-2">Small Padding</h3>
              <p className="text-sm text-text-muted">Compact card for dense information displays.</p>
            </Card>
          </div>
        </section>

        {/* Feature Items */}
        <section className="mb-24">
          <SectionHeader
            chipLabel="Components"
            headline="Feature Items"
            supporting="Icon-driven feature callouts with clear hierarchy and spacing."
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Lightning Fast"
              description="Optimized performance with instant feedback and smooth animations throughout."
              align="center"
            />
            <FeatureItem
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Secure & Private"
              description="Enterprise-grade security with end-to-end encryption and data protection."
              align="center"
            />
            <FeatureItem
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
              title="Customizable"
              description="Fully adaptable to your brand with extensive theming and configuration options."
              align="center"
            />
          </div>
        </section>

        {/* Empty State */}
        <section className="mb-24">
          <SectionHeader
            chipLabel="Components"
            headline="Empty States"
            supporting="Friendly empty states that guide users toward their next action."
          />
          
          <Card padding="none" className="mt-8">
            <EmptyState
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              }
              title="No Projects Yet"
              description="Get started by creating your first project. It only takes a few seconds to set up."
              ctaLabel="Create Project"
              onCtaClick={() => handleToastDemo('default')}
            />
          </Card>
        </section>

        {/* Loading States */}
        <section className="mb-24">
          <SectionHeader
            chipLabel="Components"
            headline="Loading States"
            supporting="Smooth spinner animations for asynchronous operations."
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card padding="lg" className="flex flex-col items-center">
              <Spinner size="sm" />
              <p className="text-sm text-text-muted mt-4">Small</p>
            </Card>
            <Card padding="lg" className="flex flex-col items-center">
              <Spinner size="md" />
              <p className="text-sm text-text-muted mt-4">Medium</p>
            </Card>
            <Card padding="lg" className="flex flex-col items-center">
              <Spinner size="lg" />
              <p className="text-sm text-text-muted mt-4">Large</p>
            </Card>
          </div>
        </section>

        {/* Toasts */}
        <section className="mb-24">
          <SectionHeader
            chipLabel="Components"
            headline="Toast Notifications"
            supporting="Non-intrusive notifications for feedback and confirmations."
          />
          
          <Card padding="lg" className="mt-8">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => handleToastDemo('success')}>
                Show Success Toast
              </Button>
              <Button variant="secondary" onClick={() => handleToastDemo('error')}>
                Show Error Toast
              </Button>
              <Button variant="secondary" onClick={() => handleToastDemo('default')}>
                Show Info Toast
              </Button>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-border text-center">
          <p className="text-sm text-text-muted">
            Listicle Writer Design System • Built with Next.js, React & Tailwind CSS
          </p>
        </footer>
      </main>

      {/* Toast */}
      {showToast && (
        <Toast variant={toastVariant} onClose={() => setShowToast(false)}>
          {toastVariant === 'success' && 'Action completed successfully!'}
          {toastVariant === 'error' && 'Something went wrong. Please try again.'}
          {toastVariant === 'default' && 'This is an informational message.'}
        </Toast>
      )}
    </div>
  );
}


