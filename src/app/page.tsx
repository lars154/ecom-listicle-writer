'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, Info, LogOut, AlertCircle, ArrowLeftRight, Users, Award, MessageSquare, Package, ListChecks, Lightbulb, TrendingUp, XCircle, Heart, Layers, ChevronDown, Link, Check, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ListicleMode, ProductBrief, HeadlineOption } from '@/lib/types';
import TemplatesGrid from '@/components/TemplatesGrid';
import { OutputViewer } from '@/components/OutputViewer';
import { BlueprintContent } from '@/components/BlueprintContent';
import { logout, getUser, isAuthenticated } from '@/lib/auth';

const listicleTypes: { id: string; label: string; mode: ListicleMode; description: string; icon: any }[] = [
  { 
    id: 'problem', 
    label: 'Problem/Symptom Awareness', 
    mode: 'ProblemOrSymptomAwareness',
    description: 'Highlights relatable problems or symptoms your audience experiences. Great for introducing solutions to pain points they didn\'t know existed. Example: "5 Signs You Need to Add Creatine to Your Routine"',
    icon: AlertCircle
  },
  { 
    id: 'comparison', 
    label: 'Comparison / Category Switch', 
    mode: 'ComparisonOrCategorySwitch',
    description: 'Contrasts old solutions with your new/better approach. Perfect for positioning against competitors or outdated methods. Example: "10 Reasons to Ditch [Old Solution] For [New Solution]"',
    icon: ArrowLeftRight
  },
  { 
    id: 'social-proof', 
    label: 'Social Proof / Reasons to Buy', 
    mode: 'SocialProofOrReasonsToBuy',
    description: 'Focuses on why customers love the product, backed by testimonials and reviews. Best for building trust and credibility through real customer experiences. Example: "5 Reasons 1,000,000+ [Audience] Are Making The Switch"',
    icon: Users
  },
  { 
    id: 'expert', 
    label: 'Expert / Celebrity Endorsement', 
    mode: 'ExpertOrCelebrityEndorsement',
    description: 'Features expert opinions, celebrity users, or influencer endorsements. Leverages authority and credibility from recognized figures. Example: "5 Reasons Why [Expert/Celebrity] Loves [Product]"',
    icon: Award
  },
  { 
    id: 'review', 
    label: 'Review / First-Person', 
    mode: 'ReviewOrEditorialFirstPerson',
    description: 'Written from a personal reviewer perspective with authentic experience. Creates relatability through a genuine testing journey. Example: "I Tried [Product]—Here\'s My Honest Review"',
    icon: MessageSquare
  },
  { 
    id: 'kit', 
    label: 'Kit / Bundle Breakdown', 
    mode: 'KitOrBundleBreakdown',
    description: 'Explains each component of a bundle or kit. Ideal for multi-product sets or subscription boxes to showcase value and variety.',
    icon: Package
  },
  { 
    id: 'how-to', 
    label: 'How-To / Routine', 
    mode: 'HowToOrRoutine',
    description: 'Step-by-step guides showing how to use the product or integrate it into daily routines. Perfect for educational content and demonstrating ease of use.',
    icon: ListChecks
  },
  { 
    id: 'myth-busting', 
    label: 'Myth-Busting / Educational', 
    mode: 'MythBustingOrEducational',
    description: 'Challenges common misconceptions in your category. Great for positioning your brand as an expert while addressing customer doubts or industry myths.',
    icon: Lightbulb
  },
  { 
    id: 'urgency', 
    label: 'Urgency / Trend', 
    mode: 'UrgencyOrTrend',
    description: 'Taps into trending topics, seasonal moments, or time-sensitive opportunities. Creates FOMO and positions product as part of current movements.',
    icon: TrendingUp
  },
  { 
    id: 'mistakes', 
    label: 'Mistakes / Doing It Wrong', 
    mode: 'MistakeOrDoingItWrong',
    description: 'Points out common mistakes people make in your category. Positions your product as the solution to avoid these pitfalls. Example: "10 Reasons You\'re Not Lazy, You\'re Just Breathing Wrong"',
    icon: XCircle
  },
  { 
    id: 'persona', 
    label: 'Persona / Reasons to Love', 
    mode: 'PersonaOrReasonsToLove',
    description: 'Speaks to specific customer personas or segments. Tailors messaging to resonate with particular audience types, lifestyles, or needs.',
    icon: Heart
  },
  { 
    id: 'hybrid', 
    label: 'Hybrid (Multiple Angles)', 
    mode: 'Hybrid',
    description: 'Combines multiple listicle approaches for comprehensive coverage. Use when one angle isn\'t enough to tell the full story.',
    icon: Layers
  },
];

type Tab = 'writer' | 'templates' | 'blueprint';
type Step = 'input' | 'headlines' | 'output';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('writer');
  const [step, setStep] = useState<Step>('input');
  const [url, setUrl] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [numberOfItems, setNumberOfItems] = useState(5);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHeadlines, setLoadingHeadlines] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [brief, setBrief] = useState<ProductBrief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState(false);
  const [typesError, setTypesError] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [additionalInfoExpanded, setAdditionalInfoExpanded] = useState(false);
  
  // New state for headline selection
  const [headlineOptions, setHeadlineOptions] = useState<HeadlineOption[]>([]);
  const [selectedHeadline, setSelectedHeadline] = useState<HeadlineOption | null>(null);

  useEffect(() => {
    // Check authentication on mount
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    setUser(getUser());
  }, [router]);

  // Always set dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const urlRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);

  const selectType = (typeId: string) => {
    setSelectedType(typeId);
    // Clear error when user selects a type
    if (typesError) {
      setTypesError(false);
    }
  };

  // Step 1: Generate headlines
  const handleGenerateHeadlines = async () => {
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

    if (!selectedType) {
      setTypesError(true);
      typesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Proceed with headline generation
    setLoadingHeadlines(true);
    setHeadlineOptions([]);
    setSelectedHeadline(null);

    try {
      const selectedMode = listicleTypes.find(type => type.id === selectedType)?.mode;
      if (!selectedMode) {
        throw new Error('Invalid listicle type selected');
      }

      const response = await fetch('/api/generate-headlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          modes: [selectedMode],
          itemCount: numberOfItems,
          additionalInfo: additionalInfo.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Headline generation failed');
      }

      const data = await response.json();
      setHeadlineOptions(data.headlines);
      setBrief(data.brief || null);
      setStep('headlines');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingHeadlines(false);
    }
  };

  // Step 2: Generate full listicle with selected headline
  const handleGenerateListicle = async () => {
    if (!selectedHeadline) return;

    setLoading(true);
    setOutput(null);
    setError(null);

    try {
      const selectedMode = listicleTypes.find(type => type.id === selectedType)?.mode;
      if (!selectedMode) {
        throw new Error('Invalid listicle type selected');
      }

      const response = await fetch('/api/generate-listicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: {
            url,
            modes: [selectedMode],
            itemCount: numberOfItems,
            additionalInfo: additionalInfo.trim() || undefined,
            selectedHeadline,
          },
          brief,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Generation failed');
      }

      const data = await response.json();
      setOutput(data.markdown);
      setBrief(data.brief || null);
      setStep('output');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMarkdown = (newMarkdown: string) => {
    setOutput(newMarkdown);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleBackToInput = () => {
    setStep('input');
    setHeadlineOptions([]);
    setSelectedHeadline(null);
  };

  const handleBackToHeadlines = () => {
    setStep('headlines');
    setOutput(null);
  };

  const handleStartOver = () => {
    setStep('input');
    setHeadlineOptions([]);
    setSelectedHeadline(null);
    setOutput(null);
    setBrief(null);
  };

  return (
    <div className="dark">
      <div className="min-h-screen bg-slate-950">
        <div className={`${activeTab === 'writer' ? 'max-w-3xl' : 'max-w-7xl'} mx-auto px-4 sm:px-6 py-8 sm:py-16 ${activeTab === 'writer' ? 'pb-32 sm:pb-36' : 'pb-8'}`}>
          <div className="flex justify-between items-center mb-8 sm:mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/conversion_edge_logo.png"
              alt="Conversion Edge Logo"
              className="h-10 sm:h-12"
            />

            <div className="flex items-center gap-2">
              {user && (
                <div className="mr-2 text-sm text-slate-400 hidden sm:block">
                  {user.name}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-full hover:bg-slate-800 transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-slate-400" />
              </button>
            </div>
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
                onClick={() => {
                  setActiveTab('writer');
                  handleStartOver();
                }}
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
                Templates
                {activeTab === 'templates' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0080FF]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`pb-4 px-1 relative text-sm font-medium transition-colors ${
                  activeTab === 'blueprint'
                    ? 'text-[#0080FF]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Blueprint
                {activeTab === 'blueprint' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0080FF]" />
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'templates' ? (
            <TemplatesGrid />
          ) : activeTab === 'blueprint' ? (
            <BlueprintContent />
          ) : (
            <div className="space-y-8">
              {/* Step 1: Input Form */}
              {step === 'input' && (
                <div>
                  <div className="space-y-8">
                    <div ref={urlRef}>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Step 1: Paste Product or Landing Page URL
                      </label>
                      <div className={`relative rounded-lg transition-all ${
                        urlError ? '' : 'bg-gradient-to-r from-blue-500 via-[#0080FF] to-cyan-500 p-[2px]'
                      }`}>
                        <div className="relative">
                          <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={1.5} />
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => {
                              setUrl(e.target.value);
                              if (urlError) setUrlError(false);
                            }}
                            placeholder="www.mysite.com"
                            className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                              urlError
                                ? 'border-2 border-red-500 focus:ring-red-500'
                                : 'focus:ring-[#0080FF] focus:ring-offset-0'
                            }`}
                          />
                        </div>
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
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Step 2: Select Listicle Type
                      </label>
                      {typesError ? (
                        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                          Please select a listicle type.
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                          Choose one. This determines both the headline style and content voice.
                        </p>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {listicleTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <div key={type.id} className="relative">
                              <div
                                onClick={() => selectType(type.id)}
                                className={`relative flex flex-col items-center justify-center p-4 border rounded-xl transition-all cursor-pointer group ${
                                  selectedType === type.id
                                    ? 'bg-blue-50 dark:bg-slate-900 border-[#0087FF]/20'
                                    : typesError
                                    ? 'bg-white dark:bg-slate-900/50 border-red-500 hover:border-red-600'
                                    : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50 hover:border-[#0087FF]/20 hover:bg-slate-50 dark:hover:bg-slate-900'
                                }`}
                              >
                                <div className="mb-2 p-2 rounded-lg border transition-colors bg-gradient-to-r from-[#0087FF]/30 to-[#0044FF]/20 border-[#0080FF]/30">
                                  <Icon className="w-4 h-4 text-[#0087FF]" strokeWidth={1.5} />
                                </div>
                                <div className={`text-xs font-medium text-center transition-colors leading-tight ${
                                  selectedType === type.id
                                    ? 'text-[#0080FF] dark:text-white'
                                    : 'text-slate-600 dark:text-slate-300'
                                }`}>
                                  {type.label}
                                </div>
                                <button
                                  type="button"
                                  className={`absolute top-2.5 right-2.5 p-1 rounded-full transition-all ${
                                    selectedType === type.id
                                      ? 'text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                                      : 'text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpenTooltip(openTooltip === type.id ? null : type.id);
                                  }}
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                              </div>
                              {openTooltip === type.id && (
                                <div className="absolute z-10 mt-2 w-full min-w-[280px] p-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg">
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
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                          Step 3: Select Number of List Items
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
                        className="w-full h-2 bg-gradient-to-r from-[#0087FF]/20 to-[#0044FF]/10 dark:from-[#0087FF]/30 dark:to-[#0044FF]/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0080FF] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/30"
                      />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 mt-2">
                        <span>3 (short)</span>
                        <span>12 (comprehensive)</span>
                      </div>
                    </div>

                    <div className="pb-8">
                      <button
                        type="button"
                        onClick={() => setAdditionalInfoExpanded(!additionalInfoExpanded)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white cursor-pointer">
                          Additional Information <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${additionalInfoExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {additionalInfoExpanded && (
                        <div className="mt-3">
                          <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                            Add any specific copy, words to use, product details, or offer information you want to include in the listicle.
                          </p>
                          <textarea
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder="E.g., Include 'Over 1,000,000 customers have switched', use CTA 'Claim My 50% Discount', mention our 90-day risk-free trial, highlight celebrity endorsements..."
                            rows={5}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-[#1E273B] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 focus:bg-slate-900 transition-all resize-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Headline Selection */}
              {step === 'headlines' && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={handleBackToInput}
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to settings
                    </button>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-2">
                      Step 4: Choose Your Headline
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Select the headline/angle that best fits your goals. The full listicle will be generated to match this voice and direction.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {headlineOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedHeadline(option)}
                        className={`relative p-5 rounded-xl border cursor-pointer transition-all ${
                          selectedHeadline?.headline === option.headline
                            ? 'bg-slate-900 border-[#0080FF] ring-2 ring-[#0080FF]/20'
                            : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedHeadline?.headline === option.headline
                              ? 'border-[#0080FF] bg-[#0080FF]'
                              : 'border-slate-600'
                          }`}>
                            {selectedHeadline?.headline === option.headline && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {option.headline}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-950 text-blue-400 border border-blue-800">
                                {option.angle}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleGenerateHeadlines}
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Generate new headlines
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Output Display */}
              {step === 'output' && output && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={handleBackToHeadlines}
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to headlines
                    </button>
                    <button
                      onClick={handleStartOver}
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors ml-auto"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Start over
                    </button>
                  </div>

                  {selectedHeadline && (
                    <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Selected Headline</p>
                      <p className="text-white font-medium">{selectedHeadline.headline}</p>
                    </div>
                  )}

                  <OutputViewer 
                    markdown={output} 
                    brief={brief}
                    onUpdateMarkdown={handleUpdateMarkdown}
                  />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-12 p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="text-sm font-semibold text-red-900 dark:text-red-400 mb-2">Error</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixed Bottom Button */}
        {activeTab === 'writer' && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="max-w-3xl mx-auto">
              {step === 'input' && (
                <button
                  disabled={loadingHeadlines}
                  onClick={handleGenerateHeadlines}
                  className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all flex items-center justify-center gap-2 ${
                    loadingHeadlines
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      : 'bg-[#0080FF] text-white hover:bg-[#0070E0]'
                  }`}
                >
                  {loadingHeadlines ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating Headlines...
                    </>
                  ) : (
                    <>
                      Generate Headlines
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}

              {step === 'headlines' && (
                <button
                  disabled={loading || !selectedHeadline}
                  onClick={handleGenerateListicle}
                  className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all flex items-center justify-center gap-2 ${
                    loading || !selectedHeadline
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      : 'bg-[#0080FF] text-white hover:bg-[#0070E0]'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating Listicle...
                    </>
                  ) : (
                    <>
                      Generate Full Listicle
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}

              {step === 'output' && (
                <button
                  onClick={handleStartOver}
                  className="w-full py-4 px-6 rounded-lg font-medium text-base transition-all flex items-center justify-center gap-2 bg-slate-800 text-white hover:bg-slate-700"
                >
                  <RefreshCw className="w-5 h-5" />
                  Start New Listicle
                </button>
              )}

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
