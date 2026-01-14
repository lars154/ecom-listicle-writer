'use client';

import { useState, useRef } from 'react';
import { Moon, Sun, Sparkles, ArrowRight, Info } from 'lucide-react';
import type { ListicleMode } from '@/lib/types';
import TemplatesGrid from '@/components/TemplatesGrid';
import { OutputViewer } from '@/components/OutputViewer';

const listicleTypes: { id: string; label: string; mode: ListicleMode; description: string }[] = [
  { 
    id: 'problem', 
    label: 'Problem/Symptom Awareness', 
    mode: 'ProblemOrSymptomAwareness',
    description: 'Highlights relatable problems or symptoms your audience experiences. Great for introducing solutions to pain points they didn\'t know existed. Example: "5 Signs You Need to Add Creatine to Your Routine"'
  },
  { 
    id: 'comparison', 
    label: 'Comparison / Category Switch', 
    mode: 'ComparisonOrCategorySwitch',
    description: 'Contrasts old solutions with your new/better approach. Perfect for positioning against competitors or outdated methods. Example: "10 Reasons to Ditch [Old Solution] For [New Solution]"'
  },
  { 
    id: 'social-proof', 
    label: 'Social Proof / Reasons to Buy', 
    mode: 'SocialProofOrReasonsToBuy',
    description: 'Focuses on why customers love the product, backed by testimonials and reviews. Best for building trust and credibility through real customer experiences. Example: "5 Reasons 1,000,000+ [Audience] Are Making The Switch"'
  },
  { 
    id: 'expert', 
    label: 'Expert / Celebrity Endorsement', 
    mode: 'ExpertOrCelebrityEndorsement',
    description: 'Features expert opinions, celebrity users, or influencer endorsements. Leverages authority and credibility from recognized figures. Example: "5 Reasons Why [Expert/Celebrity] Loves [Product]"'
  },
  { 
    id: 'review', 
    label: 'Review / First-Person', 
    mode: 'ReviewOrEditorialFirstPerson',
    description: 'Written from a personal reviewer perspective with authentic experience. Creates relatability through a genuine testing journey. Example: "I Tried [Product]—Here\'s My Honest Review"'
  },
  { 
    id: 'kit', 
    label: 'Kit / Bundle Breakdown', 
    mode: 'KitOrBundleBreakdown',
    description: 'Explains each component of a bundle or kit. Ideal for multi-product sets or subscription boxes to showcase value and variety.'
  },
  { 
    id: 'how-to', 
    label: 'How-To / Routine', 
    mode: 'HowToOrRoutine',
    description: 'Step-by-step guides showing how to use the product or integrate it into daily routines. Perfect for educational content and demonstrating ease of use.'
  },
  { 
    id: 'myth-busting', 
    label: 'Myth-Busting / Educational', 
    mode: 'MythBustingOrEducational',
    description: 'Challenges common misconceptions in your category. Great for positioning your brand as an expert while addressing customer doubts or industry myths.'
  },
  { 
    id: 'urgency', 
    label: 'Urgency / Trend', 
    mode: 'UrgencyOrTrend',
    description: 'Taps into trending topics, seasonal moments, or time-sensitive opportunities. Creates FOMO and positions product as part of current movements.'
  },
  { 
    id: 'mistakes', 
    label: 'Mistakes / Doing It Wrong', 
    mode: 'MistakeOrDoingItWrong',
    description: 'Points out common mistakes people make in your category. Positions your product as the solution to avoid these pitfalls. Example: "10 Reasons You\'re Not Lazy, You\'re Just Breathing Wrong"'
  },
  { 
    id: 'persona', 
    label: 'Persona / Reasons to Love', 
    mode: 'PersonaOrReasonsToLove',
    description: 'Speaks to specific customer personas or segments. Tailors messaging to resonate with particular audience types, lifestyles, or needs.'
  },
  { 
    id: 'hybrid', 
    label: 'Hybrid (Multiple Angles)', 
    mode: 'Hybrid',
    description: 'Combines multiple listicle approaches for comprehensive coverage. Use when one angle isn\'t enough to tell the full story.'
  },
];

type Tab = 'writer' | 'templates';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('writer');
  const [url, setUrl] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [numberOfItems, setNumberOfItems] = useState(5);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState(false);
  const [typesError, setTypesError] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  const urlRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
    // Clear error when user selects a type
    if (typesError) {
      setTypesError(false);
    }
  };

  const handleGenerate = async () => {
    // Reset errors
    setUrlError(false);
    setTypesError(false);
    setError(null);

    // Validate required fields
    if (!url.trim()) {
      setUrlError(true);
      urlRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (selectedTypes.length === 0) {
      setTypesError(true);
      typesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Proceed with generation
    setLoading(true);
    setOutput(null);

    try {
      const selectedModes = selectedTypes.map(id => 
        listicleTypes.find(type => type.id === id)?.mode
      ).filter(Boolean) as ListicleMode[];

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          modes: selectedModes,
          itemCount: numberOfItems,
          additionalInfo: additionalInfo.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Generation failed');
      }

      const data = await response.json();
      setOutput(data.markdown);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <div className={`${activeTab === 'writer' ? 'max-w-3xl' : 'max-w-7xl'} mx-auto px-4 sm:px-6 py-8 sm:py-16 ${activeTab === 'writer' ? 'pb-32 sm:pb-36' : ''}`}>
          <div className="flex justify-between items-center mb-8 sm:mb-12">
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

          <div className="mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#0080FF]" />
              <span className="text-xs font-medium text-[#0080FF] dark:text-blue-400">AI-Powered Copywriting</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Ecom Listicle Writer
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-500 max-w-2xl">
              Turn any product URL into compelling, conversion-focused listicle content in seconds.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('writer')}
                className={`pb-4 px-1 relative text-sm font-medium transition-colors ${
                  activeTab === 'writer'
                    ? 'text-[#0080FF]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Listicle Writer
                {activeTab === 'writer' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0080FF]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`pb-4 px-1 relative text-sm font-medium transition-colors ${
                  activeTab === 'templates'
                    ? 'text-[#0080FF]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Figma Templates
                {activeTab === 'templates' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0080FF]" />
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'templates' ? (
            <TemplatesGrid />
          ) : (
            <div className="space-y-8">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-6 tracking-wide uppercase">
                Configure
              </h2>

              <div className="space-y-8">
                <div ref={urlRef}>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Product or Landing Page URL
                  </label>
                  <div className={`relative rounded-lg transition-all ${
                    urlError ? '' : 'bg-gradient-to-r from-blue-500 via-[#0080FF] to-cyan-500 p-[2px]'
                  }`}>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        if (urlError) setUrlError(false);
                      }}
                      placeholder="https://example.myshopify.com/products/..."
                      className={`w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        urlError
                          ? 'border-2 border-red-500 focus:ring-red-500'
                          : 'focus:ring-[#0080FF] focus:ring-offset-0'
                      }`}
                    />
                  </div>
                  {urlError ? (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      Please enter a product or landing page URL.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      Shopify product pages or landing pages supported
                    </p>
                  )}
                </div>

                <div ref={typesRef}>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Listicle Type(s) <span className="text-red-500">*</span>
                  </label>
                  {typesError ? (
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                      Please select at least one listicle type.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                      Select one or more. Hybrid mode combines multiple angles.
                    </p>
                  )}

                  <div className="space-y-2">
                    {listicleTypes.map((type) => (
                      <div key={type.id} className="relative">
                        <label
                          className={`flex items-center gap-3 px-4 py-3.5 border rounded-lg cursor-pointer transition-all ${
                            selectedTypes.includes(type.id)
                              ? 'bg-blue-50 dark:bg-blue-950/30 border-[#0080FF]'
                              : typesError
                              ? 'bg-white dark:bg-slate-950 border-red-500 hover:border-red-600'
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                          onClick={() => toggleType(type.id)}
                        >
                          <div className={`relative flex items-center justify-center w-4 h-4 rounded border-2 transition-colors ${
                            selectedTypes.includes(type.id)
                              ? 'bg-[#0080FF] border-[#0080FF]'
                              : 'border-slate-300 bg-white dark:bg-slate-950'
                          }`}>
                            {selectedTypes.includes(type.id) && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-slate-900 dark:text-white flex-1">
                            {type.label}
                          </span>
                          <button
                            type="button"
                            className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenTooltip(openTooltip === type.id ? null : type.id);
                            }}
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </label>
                        {openTooltip === type.id && (
                          <div className="absolute z-10 mt-2 p-3 bg-slate-800 dark:bg-slate-700 text-white text-sm rounded-lg shadow-lg max-w-sm left-0 right-0">
                            <div className="relative">
                              {type.description}
                              <button
                                className="absolute -top-1 -right-1 text-slate-400 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenTooltip(null);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-900 dark:text-white">
                      Number of List Items
                    </label>
                    <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {numberOfItems}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={numberOfItems}
                    onChange={(e) => setNumberOfItems(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#0080FF]"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 mt-2">
                    <span>3 (short)</span>
                    <span>12 (comprehensive)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Additional Information <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                    Add any specific copy, words to use, product details, or offer information you want to include in the listicle.
                  </p>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="E.g., Mention our 60-day guarantee, use the phrase 'game-changer', highlight the 2-for-1 bundle offer..."
                    rows={5}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Output Display */}
            {loading && (
              <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#0080FF] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-700 dark:text-slate-300">Generating your listicle...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-12 p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-400 mb-2">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {output && (
              <div className="mt-12">
                <OutputViewer markdown={output} />
              </div>
            )}
          </div>
          )}
        </div>

        {activeTab === 'writer' && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="max-w-3xl mx-auto">
              <button
                disabled={loading}
                onClick={handleGenerate}
                className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-[#0080FF] text-white hover:bg-[#0070E0]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Listicle
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-xs text-center text-slate-500 dark:text-slate-500 mt-4">
                Built by LPG. All rights reserved.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
