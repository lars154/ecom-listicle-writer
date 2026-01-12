'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface OutputViewerProps {
  markdown: string;
}

interface Section {
  title: string;
  content: string;
}

export function OutputViewer({ markdown }: OutputViewerProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

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
                    Copy Section
                  </>
                )}
              </button>
            </div>
            <div className="px-6 py-5 prose prose-sm max-w-none
              dark:prose-invert
              prose-headings:font-bold
              prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-2
              prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-4
              prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-3
              prose-p:leading-relaxed prose-p:mb-3
              prose-ul:my-3
              prose-ol:my-3
              prose-li:my-1
              prose-strong:font-bold
              prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic
              prose-hr:my-6
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
