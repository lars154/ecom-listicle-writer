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
          {/* 1. Problem/Symptom Awareness */}
          <CollapsibleSection title="1. Problem/Symptom Awareness Listicle">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298483848_lf0jq2_Create%20Listicle%202.png?alt=media&token=3fdc3040-88ae-458e-964a-4d3db72d8c82"
              alt="Problem/Symptom Awareness Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"5 Signs You Need to Add [Product/Category] to Your Daily Routine"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Intro:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Start with a double-barreled question or pain point. Validate with a stat or "you're not alone." Tease the list.</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Reason:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Numbered, bolded, specific</li>
                  <li>• "You" scenario</li>
                  <li>• Simple explanation</li>
                  <li>• Agitate with "what this means"</li>
                  <li>• Visual</li>
                  <li>• Transition</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">After 3–5 reasons:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Product intro as "diagnosis" moment, bulleted benefits</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Offer/CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Try [Product] risk-free for [X] days." [Claim My Discount]</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">FAQ:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">4–6 real objections</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Final CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Recap, restate offer, CTA</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* 2. Comparison/Category Switch */}
          <CollapsibleSection title="2. Comparison/Category Switch Listicle">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298479402_elpfkc_Carpe%20Listicle%201.png?alt=media&token=1f2d1f32-3b97-4393-9f80-e7836c58a769"
              alt="Comparison/Category Switch Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"10 Reasons to Ditch [Old Solution] For [New Solution/Category]"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Intro:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Acknowledge the old solution, tease the new way.</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Reason:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Numbered, bolded, "problem with the old way"</li>
                  <li>• "You" frustration</li>
                  <li>• Why old way fails</li>
                  <li>• New way as solution</li>
                  <li>• Visual</li>
                  <li>• Transition</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">After 3–5 reasons:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Product intro as "solution reveal," bulleted benefits</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Offer/CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Get [X]% off for a limited time." [Shop Now]</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* 3. Social Proof/Reasons to Buy */}
          <CollapsibleSection title="3. Social Proof/Reasons to Buy Listicle">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298468805_zhheil_Hexclad%20Listicle%201.png?alt=media&token=969e593d-fbe8-4727-a81f-3460ec7f3174"
              alt="Social Proof/Reasons to Buy Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"5 Reasons 1,000,000+ [Audience] Are Making The Switch"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Intro:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Over 1,000,000 [audience] have made the switch. Here's why."</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Reason:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Numbered, bolded, benefit-driven</li>
                  <li>• "You" scenario</li>
                  <li>• Proof/testimonial</li>
                  <li>• Visual</li>
                  <li>• Transition</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Offer/CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Up to [X]% off best-selling sets." [Shop Now]</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* 4. Expert/Celebrity Endorsement */}
          <CollapsibleSection title="4. Expert/Celebrity Endorsement Listicle">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298485997_f92is1_Create%20Listicle%201.png?alt=media&token=aad64dbd-481c-474d-9e3c-d3d55f83faa1"
              alt="Expert/Celebrity Endorsement Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"5 Reasons Why [Expert] Loves [Product]"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Intro:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Meet [Expert]: [Credentials/Authority]. For [X] years, [Expert] has helped [audience] achieve [result]. Here's why they recommend [Product]."</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Reason:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Numbered, bolded, expert-quoted</li>
                  <li>• Expert quote</li>
                  <li>• Explanation</li>
                  <li>• Visual</li>
                  <li>• Transition</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Offer/CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Use code [EXPERT] for [X]% off." [Claim [Expert]'s Discount]</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* 5. Review/Editorial/First-Person */}
          <CollapsibleSection title="5. Review/Editorial/First-Person Listicle">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298458077_0n5poi_Gru%CC%88ns%20Listicle%201.png?alt=media&token=ed852c87-6d33-4ed4-99e7-03f370e0f7bb"
              alt="Review/Editorial/First-Person Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"I Tried [Product]—Here's My Honest Review"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Intro:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"As a [role], I'm always looking for [desired outcome]. I'd heard about [Product] everywhere, so I decided to try it for myself."</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Reason:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Numbered, bolded, experience-driven</li>
                  <li>• Personal experience</li>
                  <li>• Explanation</li>
                  <li>• Visual</li>
                  <li>• Transition</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Offer/CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Start Here" [Shop Now]</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* 6. Kit/Bundle Breakdown */}
          <CollapsibleSection title="6. Kit/Bundle Breakdown Listicle">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298462429_47302k_Jones%20Road%20Listicle%202.png?alt=media&token=39052605-cc4f-4f84-900e-8bc7306da1af"
              alt="Kit/Bundle Breakdown Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"5 Reasons Why This [Kit/Bundle] Is a Must-Have"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Intro:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"This kit is only available for a limited time and includes products you can't get anywhere else."</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Reason:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Numbered, bolded, feature/benefit-driven</li>
                  <li>• Explanation</li>
                  <li>• Visual</li>
                  <li>• Transition</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Offer/CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"[X]% discount for a limited time" [Shop the Kit]</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* 7. How-To/Routine */}
          <CollapsibleSection title="7. How-To/Routine Listicle">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298431656_ldlnj9_Ogee%20Listicle%203.png?alt=media&token=466f799d-d0a1-4d52-9d66-0469a7b00095"
              alt="How-To/Routine Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"How to [Achieve Desired Result] in [X Steps]"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Intro:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Tired of [pain]? Here's how to [achieve result] in just [X] steps."</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Step:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Step headline</li>
                  <li>• Instruction</li>
                  <li>• Explanation/why</li>
                  <li>• Visual</li>
                  <li>• Transition</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Recap/CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Recap outcome, restate benefit, CTA</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* 8. Myth-Busting/Educational */}
          <CollapsibleSection title="8. Myth-Busting/Educational Listicle">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298441969_knox8w_Hostage%20Tape%20Listicle%202.png?alt=media&token=9793950e-0b51-44a7-915e-6afaf29b47d1"
              alt="Myth-Busting/Educational Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"7 Myths About [Product/Category]" or "10 Things You Didn't Know About [Problem/Solution]"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Intro:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Most people think [myth], but the truth is…"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Item:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Numbered, bolded, myth/truth-driven</li>
                  <li>• Myth</li>
                  <li>• Truth</li>
                  <li>• Explanation</li>
                  <li>• Visual</li>
                  <li>• Transition</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Offer/CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Try [Product] risk-free." [Shop Now]</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* 9. Urgency/Trend */}
          <CollapsibleSection title="9. Urgency/Trend Listicle">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298473261_xym9dh_Javvy%20Listicle%202.png?alt=media&token=60e612ab-2735-40ea-b50e-58834446f5d6"
              alt="Urgency/Trend Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"7 Reasons to Try [Product] Before [Event/Deadline]" or "12 Reasons [Product] Is the Trend of [Year]"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Intro:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"This is the trend everyone's talking about. Here's why you need to try it now."</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Item:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Numbered, bolded, trend/benefit-driven</li>
                  <li>• Explanation</li>
                  <li>• Visual</li>
                  <li>• Transition</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Offer/CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Black Friday VIP access: up to 60% off and free gifts." [Get VIP Access]</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* 10. Mistake/"You're Doing It Wrong" */}
          <CollapsibleSection title={`10. Mistake/"You're Doing It Wrong" Listicle`}>
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298441969_knox8w_Hostage%20Tape%20Listicle%202.png?alt=media&token=9793950e-0b51-44a7-915e-6afaf29b47d1"
              alt="Mistake - You're Doing It Wrong Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"5 Mistakes You're Making With [Product/Category]" or "10 Reasons You're Not Getting Results With [Product/Category]"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Intro:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"You're not getting results because you're making these mistakes…"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Item:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Numbered, bolded, mistake-driven</li>
                  <li>• Scenario</li>
                  <li>• Consequence</li>
                  <li>• Science/proof</li>
                  <li>• Visual</li>
                  <li>• Transition</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Offer/CTA:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Try [Product] risk-free." [Shop Now]</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* 11. Hybrid */}
          <CollapsibleSection title="11. Hybrid Listicles">
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298468805_zhheil_Hexclad%20Listicle%201.png?alt=media&token=969e593d-fbe8-4727-a81f-3460ec7f3174"
              alt="Hybrid Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <ul className="ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Pick two or more types (e.g., social proof + comparison + feature/benefit)</li>
                <li>• Structure the list so each reason covers a different angle</li>
                <li>• Use testimonials, stats, and product images throughout</li>
                <li>• End with a strong offer and CTA</li>
              </ul>
            </div>
          </CollapsibleSection>

          {/* 12. Persona/"Reasons to Love" */}
          <CollapsibleSection title={`12. Persona/"Reasons to Love" Listicle`}>
            <ExampleImage 
              src="https://firebasestorage.googleapis.com/v0/b/poppy-ai-16252.appspot.com/o/uploads%2Fv4PTbelDBaYNNmbskPGQOrEVz4T2_1763298453596_sh2e63_Polishpops%20Listicle%201.png?alt=media&token=ab41e958-3c90-4ef3-b367-c3aa578771db"
              alt="Persona/Reasons to Love Listicle Example"
            />
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Headline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"5 Reasons Why Thousands of Women Are Switching to [Product]"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Subheadline:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">Direct benefit statement ("Gel Polish Pops' gel manicures are your quick and easy way to get a picture-perfect manicure that lasts 14+ days.")</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Each Reason:</span>
                <ul className="mt-1 ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Benefit-driven headline ("Easily Get a Manicure in Minutes")</li>
                  <li>• Short, direct explanation</li>
                  <li>• Visual (product, hands, packaging)</li>
                  <li>• Testimonial (if present)</li>
                  <li>• Transition to next reason</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">CTA and badges:</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">"Shop Now," badges for credibility</span>
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
