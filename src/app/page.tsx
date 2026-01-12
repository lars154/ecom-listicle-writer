'use client';

import { useState } from 'react';
import { Moon, Sun, Sparkles, ArrowRight } from 'lucide-react';
import type { ListicleMode } from '@/lib/types';
import TemplatesGrid from '@/components/TemplatesGrid';
import { OutputViewer } from '@/components/OutputViewer';

const listicleTypes: { id: string; label: string; mode: ListicleMode }[] = [
  { id: 'problem', label: 'Problem/Symptom Awareness', mode: 'ProblemOrSymptomAwareness' },
  { id: 'comparison', label: 'Comparison / Category Switch', mode: 'ComparisonOrCategorySwitch' },
  { id: 'social-proof', label: 'Social Proof / Reasons to Buy', mode: 'SocialProofOrReasonsToBuy' },
  { id: 'expert', label: 'Expert / Celebrity Endorsement', mode: 'ExpertOrCelebrityEndorsement' },
  { id: 'review', label: 'Review / First-Person', mode: 'ReviewOrEditorialFirstPerson' },
  { id: 'kit', label: 'Kit / Bundle Breakdown', mode: 'KitOrBundleBreakdown' },
  { id: 'how-to', label: 'How-To / Routine', mode: 'HowToOrRoutine' },
  { id: 'myth-busting', label: 'Myth-Busting / Educational', mode: 'MythBustingOrEducational' },
  { id: 'urgency', label: 'Urgency / Trend', mode: 'UrgencyOrTrend' },
  { id: 'mistakes', label: 'Mistakes / Doing It Wrong', mode: 'MistakeOrDoingItWrong' },
  { id: 'persona', label: 'Persona / Reasons to Love', mode: 'PersonaOrReasonsToLove' },
  { id: 'hybrid', label: 'Hybrid (Multiple Angles)', mode: 'Hybrid' },
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

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
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

  const canGenerate = url.trim() !== '' && selectedTypes.length > 0;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <div className={`${activeTab === 'writer' ? 'max-w-3xl' : 'max-w-7xl'} mx-auto px-4 sm:px-6 py-8 sm:py-16 ${activeTab === 'writer' ? 'pb-[500px]' : ''}`}>
          <div className="flex justify-between items-center mb-8 sm:mb-12">
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
              Listicle Writer
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
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Product or Landing Page URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.myshopify.com/products/..."
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Shopify product pages or landing pages supported
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Listicle Type(s) <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                    Select one or more. Hybrid mode combines multiple angles.
                  </p>

                  <div className="space-y-2">
                    {listicleTypes.map((type) => (
                      <label
                        key={type.id}
                        className={`flex items-center gap-3 px-4 py-3.5 border rounded-lg cursor-pointer transition-all ${
                          selectedTypes.includes(type.id)
                            ? 'bg-blue-50 dark:bg-blue-950/30 border-[#0080FF]'
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
                        <span className="text-sm text-slate-900 dark:text-white">
                          {type.label}
                        </span>
                      </label>
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
                disabled={!canGenerate || loading}
                onClick={handleGenerate}
                className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all flex items-center justify-center gap-2 ${
                  canGenerate && !loading
                    ? 'bg-[#0080FF] text-white hover:bg-[#0070E0]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
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
