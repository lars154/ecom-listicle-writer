'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronRight, CheckSquare, Square, List } from 'lucide-react';

// Checklist state for the interactive checklist
const checklistItems = [
  'Numbered headline with a clear promise',
  'Short, relatable intro',
  'Each item: headline, 2–3 sentences, visual, transition',
  'Social proof (testimonials, star ratings, customer counts)',
  'Product intro and offer (if appropriate)',
  'FAQ (if appropriate)',
  'Final CTA and recap',
];

// Table of contents items
const tocItems = [
  { id: 'why-listicles-work', label: 'Why Listicles Work', num: '1' },
  { id: 'content-types', label: 'Listicle Content Types', num: '2' },
  { id: 'anatomy', label: 'Anatomy of a High-Converting Listicle', num: '3' },
  { id: 'writing-guide', label: 'Step-by-Step Writing Guide', num: '4' },
  { id: 'checklist', label: 'The Complete Checklist', num: '5' },
  { id: 'takeaway', label: 'Final Takeaway', num: '6' },
];

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
      >
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-[#0080FF] flex-shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
        <span className="font-semibold text-slate-900 dark:text-white">{title}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-4 bg-white dark:bg-slate-900">
          {children}
        </div>
      )}
    </div>
  );
}

function ExampleImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 relative">
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-[#0080FF] rounded-full animate-spin" />
        </div>
      )}
      {hasError ? (
        <div className="h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-sm">
          Image unavailable
        </div>
      ) : (
        <Image 
          src={src} 
          alt={alt}
          width={400}
          height={300}
          className={`w-full max-w-md mx-auto transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          unoptimized
        />
      )}
    </div>
  );
}

function TableOfContents() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile TOC - Floating button */}
      <div className="lg:hidden fixed bottom-24 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-[#0080FF] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0070E0] transition-colors"
          aria-label="Table of contents"
        >
          <List className="w-5 h-5" />
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute bottom-14 right-0 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Table of Contents</h3>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left px-2 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0080FF] hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs flex items-center justify-center text-slate-500 dark:text-slate-400">
                      {item.num}
                    </span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Desktop TOC - Inline card */}
      <div className="hidden lg:block mb-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <List className="w-4 h-4 text-[#0080FF]" />
          Table of Contents
        </h3>
        <nav className="grid grid-cols-2 gap-2">
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0080FF] hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="w-6 h-6 rounded-full bg-[#0080FF]/10 text-[#0080FF] text-xs flex items-center justify-center font-medium">
                {item.num}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

export function BlueprintContent() {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleCheck = (index: number) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          The Ultimate Listicle Blueprint
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Your complete guide to writing high-converting listicle content for e-commerce.
        </p>
      </div>

      {/* Table of Contents */}
      <TableOfContents />

      {/* Why Listicles Work */}
      <section id="why-listicles-work" className="mb-10 scroll-mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#0080FF] text-white flex items-center justify-center text-sm font-bold">1</span>
          Why Listicles Work
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Listicles are the most flexible, shareable, and conversion-friendly format in digital marketing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3 font-medium">They work because they:</p>
        <ul className="space-y-2 mb-0">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0080FF] mt-2 flex-shrink-0"></span>
            <span><strong className="text-slate-900 dark:text-white">Create commitment:</strong> <span className="text-slate-600 dark:text-slate-400">If you read #1, you'll read #2 (Zeigarnik Effect)</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0080FF] mt-2 flex-shrink-0"></span>
            <span><strong className="text-slate-900 dark:text-white">Are scannable:</strong> <span className="text-slate-600 dark:text-slate-400">Perfect for mobile and short attention spans</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0080FF] mt-2 flex-shrink-0"></span>
            <span><strong className="text-slate-900 dark:text-white">Feel educational:</strong> <span className="text-slate-600 dark:text-slate-400">They teach, not just sell</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0080FF] mt-2 flex-shrink-0"></span>
            <span><strong className="text-slate-900 dark:text-white">Build trust:</strong> <span className="text-slate-600 dark:text-slate-400">Use testimonials, expert quotes, and customer counts</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0080FF] mt-2 flex-shrink-0"></span>
            <span><strong className="text-slate-900 dark:text-white">Are versatile:</strong> <span className="text-slate-600 dark:text-slate-400">Use them for problem awareness, solution comparison, product differentiation, or direct sales</span></span>
          </li>
        </ul>
      </section>

      {/* Listicle Content Types */}
      <section id="content-types" className="mb-10 scroll-mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#0080FF] text-white flex items-center justify-center text-sm font-bold">2</span>
          Listicle Content Types
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4 font-medium">
          Listicles are a format, not a type. You can use them to:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Reveal problems or symptoms',
            'Bust myths or misconceptions',
            'Compare solutions or products',
            'List benefits or reasons to buy',
            'Showcase expert/celebrity endorsement',
            'Provide honest reviews',
            'Break down a kit or bundle',
            'Show a step-by-step routine',
            'Create urgency or trend awareness',
            'Highlight mistakes or "doing it wrong" moments',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0080FF] flex-shrink-0"></span>
              {item}
            </div>
          ))}
        </div>
        <p className="text-slate-500 dark:text-slate-500 text-sm mt-4 italic">
          Mix and match these types, or use them at different funnel stages.
        </p>
      </section>

      {/* Anatomy of a High-Converting Listicle */}
      <section id="anatomy" className="mb-10 scroll-mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#0080FF] text-white flex items-center justify-center text-sm font-bold">3</span>
          Anatomy of a High-Converting Listicle
        </h2>
        <div className="space-y-4">
          {[
            {
              num: '1',
              title: 'Numbered Headline',
              content: 'Use a number and a clear promise.',
              example: '"5 Signs You Need to Add Creatine to Your Daily Routine"'
            },
            {
              num: '2',
              title: 'Short, Relatable Introduction',
              content: 'Open with a pain, question, or scenario your reader recognizes.',
              example: '"Do you drag yourself through workouts, no matter how much you sleep?"'
            },
            {
              num: '3',
              title: 'Numbered List Items',
              content: 'Each with a clear headline, 2–3 sentences, and a relevant image.',
              bullets: [
                'State the sign, myth, reason, or benefit',
                'Explain why it matters or what causes it',
                'Agitate the pain or show the benefit',
                'Use a visual (product in use, diagram, or person experiencing the problem)',
                'Transition to the next item'
              ]
            },
            {
              num: '4',
              title: 'Social Proof Throughout',
              content: 'After a key reason, add a testimonial, star rating, or customer count.'
            },
            {
              num: '5',
              title: 'Product Introduction (if appropriate)',
              content: 'After 3–5 reasons, introduce your product as the answer. List 3–5 unique benefits in bullet points.'
            },
            {
              num: '6',
              title: 'Offer/CTA (if appropriate)',
              content: 'State your offer (discount, guarantee, etc.).',
              example: '"Claim My 50% Discount", "Check If Still Available"'
            },
            {
              num: '7',
              title: 'FAQ Section (if needed)',
              content: 'Answer 5–8 common questions or objections.'
            },
            {
              num: '8',
              title: 'Final CTA and Recap',
              content: 'Recap the main benefit, restate the offer or guarantee, show a testimonial or customer count, and include a CTA button.'
            },
          ].map((item) => (
            <div key={item.num} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {item.num}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-0">{item.content}</p>
                {item.example && (
                  <p className="text-sm text-[#0080FF] mt-1 mb-0">Example: {item.example}</p>
                )}
                {item.bullets && (
                  <ul className="mt-2 space-y-1 mb-0">
                    {item.bullets.map((bullet, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-[#0080FF]">{i + 1}.</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-Step Writing Guide */}
      <section id="writing-guide" className="mb-10 scroll-mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#0080FF] text-white flex items-center justify-center text-sm font-bold">4</span>
          Step-by-Step Writing Guide for Each Listicle Type
        </h2>
        
        <div className="space-y-3">
          {/* 1. First-Person Review */}
          <CollapsibleSection title="1. First-Person Review" defaultOpen={true}>
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298458077_0n5poi_Gru%CC%88ns%20Listicle%201.png?alt=media&token=ed852c87-6d33-4ed4-99e7-03f370e0f7bb"
              alt="First-Person Review Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="font-semibold text-blue-900 dark:text-blue-200">Voice:</span>
                <span className="text-blue-700 dark:text-blue-300 ml-2">Personal, experiential, "I tested it so you don't have to"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Best for:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Products that benefit from personal testimony—supplements, skincare, lifestyle products</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Example Headlines:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• "I Tried Grüns Gummies for 30 Days—Here Are 5 Things That Happened"</li>
                  <li>• "5 Reasons I Ditched My Old Laundry Detergent for Laundry Sauce"</li>
                  <li>• "I Was Skeptical About Mouth Tape—Then These 5 Things Changed My Mind"</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Structure:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• <strong>Intro:</strong> Personal context + skepticism/curiosity</li>
                  <li>• <strong>Each item:</strong> "I noticed…", "What surprised me…", "The result was…"</li>
                  <li>• <strong>Tone:</strong> Honest, relatable, specific observations</li>
                  <li>• <strong>CTA:</strong> "If you're like me…" or "Try it yourself"</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>

          {/* 2. Problem Awareness */}
          <CollapsibleSection title="2. Problem Awareness">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298483848_lf0jq2_Create%20Listicle%202.png?alt=media&token=3fdc3040-88ae-458e-964a-4d3db72d8c82"
              alt="Problem Awareness Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="font-semibold text-blue-900 dark:text-blue-200">Voice:</span>
                <span className="text-blue-700 dark:text-blue-300 ml-2">Educational, diagnostic, "you might not realize this but…"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Best for:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Health, wellness, performance products—anything where the customer may not know they have a problem</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Example Headlines:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• "5 Signs You're Dehydrated (And Don't Even Know It)"</li>
                  <li>• "5 Warning Signs Your Sleep Quality Is Sabotaging Your Day"</li>
                  <li>• "5 Hidden Signs Your Cookware Is Ruining Your Food"</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Structure:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• <strong>Intro:</strong> "Do you ever…?" + validation</li>
                  <li>• <strong>Each item:</strong> Symptom → Why it happens → What it means</li>
                  <li>• <strong>Tone:</strong> Empathetic, revealing, creates "aha" moments</li>
                  <li>• <strong>Product intro:</strong> "The good news is…" after 3-5 items</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>

          {/* 3. Social Proof & Authority */}
          <CollapsibleSection title="3. Social Proof & Authority">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298468805_zhheil_Hexclad%20Listicle%201.png?alt=media&token=969e593d-fbe8-4727-a81f-3460ec7f3174"
              alt="Social Proof & Authority Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="font-semibold text-blue-900 dark:text-blue-200">Voice:</span>
                <span className="text-blue-700 dark:text-blue-300 ml-2">Credibility-driven, "experts agree", "thousands have switched"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Best for:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Products with celebrity endorsements, expert backing, or strong customer numbers</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Example Headlines:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• "5 Reasons Gordon Ramsay Only Uses HexClad in His Kitchen"</li>
                  <li>• "5 Reasons 500,000+ Home Chefs Made the Switch to HexClad"</li>
                  <li>• "5 Reasons Dermatologists Recommend Ogee for Sensitive Skin"</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Structure:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• <strong>Intro:</strong> Authority hook (expert name, customer count, award)</li>
                  <li>• <strong>Each item:</strong> Quote or stat → Why it matters → Proof point</li>
                  <li>• <strong>Tone:</strong> Third-party validation, trust signals throughout</li>
                  <li>• <strong>CTA:</strong> "Join 500,000+ customers" or "See why [Expert] recommends it"</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>

          {/* 4. Comparison */}
          <CollapsibleSection title="4. Comparison">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298479402_elpfkc_Carpe%20Listicle%201.png?alt=media&token=1f2d1f32-3b97-4393-9f80-e7836c58a769"
              alt="Comparison Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="font-semibold text-blue-900 dark:text-blue-200">Voice:</span>
                <span className="text-blue-700 dark:text-blue-300 ml-2">Contrast-driven, "old way vs. new way", "why X beats Y"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Best for:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Market disruption, category switching, "better alternative" positioning</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Example Headlines:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• "5 Reasons to Ditch Regular Detergent for Laundry Sauce"</li>
                  <li>• "5 Ways Carpe Outperforms Traditional Antiperspirants"</li>
                  <li>• "5 Reasons Flaus Beats Regular Dental Floss"</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Structure:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• <strong>Intro:</strong> Acknowledge the old solution, tease the upgrade</li>
                  <li>• <strong>Each item:</strong> Old way problem → New way solution → Benefit</li>
                  <li>• <strong>Tone:</strong> Educational, not attacking—show why it's better</li>
                  <li>• <strong>CTA:</strong> "Make the switch" or "Try the upgrade"</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>

          {/* 5. Hybrid */}
          <CollapsibleSection title="5. Hybrid (Mix & Match)">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298468805_zhheil_Hexclad%20Listicle%201.png?alt=media&token=969e593d-fbe8-4727-a81f-3460ec7f3174"
              alt="Hybrid Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="font-semibold text-blue-900 dark:text-blue-200">Voice:</span>
                <span className="text-blue-700 dark:text-blue-300 ml-2">Flexible, combines multiple angles for maximum persuasion</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Best for:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Products with multiple selling angles—benefits, social proof, comparisons all in one</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Example Headlines:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• "5 Reasons HexClad Is Taking Over Home Kitchens"</li>
                  <li>• "5 Things That Make Javvy Different From Regular Coffee"</li>
                  <li>• "5 Reasons Jones Road Beauty Is Worth the Hype"</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Structure:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• <strong>Item 1-2:</strong> Problem awareness or comparison angle</li>
                  <li>• <strong>Item 3:</strong> Social proof (testimonial, stat, or expert quote)</li>
                  <li>• <strong>Item 4-5:</strong> Feature/benefit driven with specific outcomes</li>
                  <li>• <strong>Tone:</strong> Varied but cohesive—each item builds on the last</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </section>

      {/* Interactive Checklist */}
      <section id="checklist" className="mb-10 scroll-mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#0080FF] text-white flex items-center justify-center text-sm font-bold">5</span>
          The Complete Listicle Checklist
        </h2>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2">
          {checklistItems.map((item, index) => (
            <button
              key={index}
              onClick={() => toggleCheck(index)}
              className="w-full flex items-center gap-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              {checkedItems.has(index) ? (
                <CheckSquare className="w-5 h-5 text-[#0080FF] flex-shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
              <span className={`text-sm ${checkedItems.has(index) ? 'text-slate-500 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                {item}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 text-center">
          {checkedItems.size}/{checklistItems.length} completed
        </p>
      </section>

      {/* Final Takeaway */}
      <section id="takeaway" className="mb-6 scroll-mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#0080FF] text-white flex items-center justify-center text-sm font-bold">6</span>
          Final Takeaway
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            <strong className="text-slate-900 dark:text-white">Listicles are not a single "type" of content—they are a flexible vehicle for breaking down educational, persuasive, or comparative content into digestible, scannable chunks.</strong>
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            You can use them for problem awareness, solution comparison, product differentiation, or direct sales.
          </p>
          <p className="text-[#0080FF] font-semibold">
            Mix and match these types as needed for your brand, product, and audience.
          </p>
        </div>
      </section>
    </div>
  );
}
