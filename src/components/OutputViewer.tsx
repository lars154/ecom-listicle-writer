'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageSquare, Sparkles } from 'lucide-react';
import type { ProductBrief } from '@/lib/types';

interface OutputViewerProps {
  markdown: string;
  brief?: ProductBrief | null;
  onUpdateMarkdown?: (newMarkdown: string) => void;
}

interface Section {
  title: string;
  content: string;
}

export function OutputViewer({ markdown, brief, onUpdateMarkdown }: OutputViewerProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [revisionInstruction, setRevisionInstruction] = useState('');
  const [isRevising, setIsRevising] = useState(false);
  const [revisionError, setRevisionError] = useState<string | null>(null);
  const [showRevisePanel, setShowRevisePanel] = useState(false);

  // Split markdown into sections based on ## headings (but not ### or #)
  const parseSections = (text: string): Section[] => {
    const sections: Section[] = [];
    const lines = text.split('\n');
    let currentSection: Section | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      // Check for H2 heading (## but not ###)
      if (line.match(/^## [^#]/)) {
        // Save previous section
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
        }
        // Start new section
        currentSection = {
          title: line.replace(/^## /, '').trim(),
          content: '',
        };
        currentContent = [];
      } else if (line.match(/^# [^#]/)) {
        // H1 heading - treat as a section
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace(/^# /, '').trim(),
          content: '',
        };
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      } else {
        // Content before first heading
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      sections.push(currentSection);
    }

    return sections.filter(s => s.content.length > 0);
  };

  const copyToClipboard = async (text: string, identifier: string = 'all') => {
    await navigator.clipboard.writeText(text);
    if (identifier === 'all') {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } else {
      setCopiedSection(identifier);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const handleQuickRevision = async (instruction: string) => {
    setRevisionInstruction(instruction);
    await handleRevise(instruction);
  };

  const handleRevise = async (instruction?: string) => {
    const instructionToUse = instruction || revisionInstruction;
    
    if (!instructionToUse.trim()) {
      setRevisionError('Please enter a revision instruction');
      return;
    }

    setIsRevising(true);
    setRevisionError(null);

    try {
      const response = await fetch('/api/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown,
          instruction: instructionToUse,
          brief: brief || undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Revision failed');
      }

      const data = await response.json();
      
      // Update the markdown via callback
      if (onUpdateMarkdown) {
        onUpdateMarkdown(data.markdown);
      }
      
      // Clear instruction after successful revision
      setRevisionInstruction('');
      setRevisionError(null);
    } catch (err: any) {
      setRevisionError(err.message);
    } finally {
      setIsRevising(false);
    }
  };

  const sections = parseSections(markdown);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wide uppercase">
            Generated Output
          </h2>
        </div>
        <button
          onClick={() => copyToClipboard(markdown)}
          className="px-4 py-2 bg-[#0080FF] text-white text-sm font-medium rounded-md hover:bg-[#0070E0] transition-colors flex items-center gap-2"
        >
          {copiedAll ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy All
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{section.title}</h3>
              <button
                onClick={() => copyToClipboard(`## ${section.title}\n\n${section.content}`, `section-${index}`)}
                className="px-3 py-1.5 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
              >
                {copiedSection === `section-${index}` ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="px-6 py-5 prose prose-sm max-w-none
              prose-slate
              dark:prose-invert
              text-slate-700 dark:text-slate-300
              prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-headings:font-bold
              prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-2
              prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-4
              prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-3
              prose-p:text-slate-700 dark:prose-p:text-slate-300
              prose-p:leading-relaxed prose-p:mb-3
              prose-ul:my-3
              prose-ol:my-3
              prose-li:my-1
              prose-li:text-slate-700 dark:prose-li:text-slate-300
              prose-strong:font-bold prose-strong:text-slate-900 dark:prose-strong:text-white
              prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic
              prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400
              prose-hr:my-6
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* Revise with AI Panel */}
      <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
        <button
          onClick={() => setShowRevisePanel(!showRevisePanel)}
          className="flex items-center gap-2 text-[#0080FF] hover:text-[#0070E0] font-medium text-sm transition-colors mb-4"
        >
          <MessageSquare className="w-4 h-4" />
          {showRevisePanel ? 'Hide' : 'Revise with AI'}
        </button>

        {showRevisePanel && (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#0080FF]" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Ask AI to revise your listicle
              </h3>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleQuickRevision('Make it shorter and more concise')}
                disabled={isRevising}
                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Make it shorter
              </button>
              <button
                onClick={() => handleQuickRevision('Make it more concise while keeping all key benefits')}
                disabled={isRevising}
                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                More concise
              </button>
              <button
                onClick={() => handleQuickRevision('Make the tone more playful and conversational')}
                disabled={isRevising}
                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                More playful
              </button>
              <button
                onClick={() => handleQuickRevision('Make the tone more professional and serious')}
                disabled={isRevising}
                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                More professional
              </button>
            </div>

            {/* Custom Instruction */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Or type a custom instruction
              </label>
              <textarea
                value={revisionInstruction}
                onChange={(e) => setRevisionInstruction(e.target.value)}
                placeholder="E.g., Add more social proof with customer counts, make the CTA more urgent, include a testimonial after reason #3, emphasize the risk-free trial..."
                rows={3}
                disabled={isRevising}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={() => handleRevise()}
              disabled={isRevising || !revisionInstruction.trim()}
              className="w-full py-3 px-4 bg-[#0080FF] text-white text-sm font-medium rounded-lg hover:bg-[#0070E0] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRevising ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Revising...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Revise Listicle
                </>
              )}
            </button>

            {revisionError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">{revisionError}</p>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-500">
              💡 Tip: The AI will only use facts from your product page. It won't invent new features or benefits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
