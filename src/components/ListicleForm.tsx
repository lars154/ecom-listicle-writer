'use client';

import { useState } from 'react';
import type { ListicleMode } from '@/lib/types';
import { Card, Button, Input, TogglePill, Chip, Divider } from '@/components/ui';

interface ListicleFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const LISTICLE_MODES: { value: ListicleMode; label: string }[] = [
  { value: 'FirstPersonReview', label: 'First-Person Review' },
  { value: 'ProblemAwareness', label: 'Problem Awareness' },
  { value: 'SocialProofAuthority', label: 'Social Proof / Authority' },
  { value: 'Comparison', label: 'Comparison' },
  { value: 'Hybrid', label: 'Hybrid (Mix Angles)' },
];

export function ListicleForm({ onSubmit, loading }: ListicleFormProps) {
  const [url, setUrl] = useState('');
  const [selectedMode, setSelectedMode] = useState<ListicleMode>('SocialProofAuthority');
  const [itemCount, setItemCount] = useState(5);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      url,
      modes: [selectedMode], // Keep as array for API compatibility
      itemCount,
      additionalInfo: additionalInfo.trim() || undefined,
    });
  };

  return (
    <Card>
      <div className="mb-6">
        <Chip variant="accent">Configure</Chip>
        <h2 className="text-[22px] font-extrabold text-text mt-3">
          Listicle Generator
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <Input
            type="url"
            label="Product or Landing Page URL"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.myshopify.com/products/..."
            disabled={loading}
            helperText="Shopify product pages or landing pages supported"
          />
        </div>

        <Divider />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Listicle Type <span className="text-accent">*</span>
            </label>
            <p className="text-xs text-text-muted mb-3">
              Choose one. This determines both the headline style and content voice.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LISTICLE_MODES.map((mode) => (
              <TogglePill
                key={mode.value}
                selected={selectedMode === mode.value}
                onClick={() => setSelectedMode(mode.value)}
                disabled={loading}
              >
                {mode.label}
              </TogglePill>
            ))}
          </div>
        </div>

        <Divider />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="itemCount" className="block text-sm font-semibold text-text">
              Number of List Items
            </label>
            <Chip variant="neutral">{itemCount} items</Chip>
          </div>
          <input
            type="range"
            id="itemCount"
            min="3"
            max="12"
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
            disabled={loading}
            className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-xs text-text-muted">
            <span>3 (short)</span>
            <span>12 (comprehensive)</span>
          </div>
        </div>

        <Divider />

        <div className="space-y-3">
          <label htmlFor="additionalInfo" className="block text-sm font-semibold text-text">
            Additional Information <span className="text-text-muted font-normal">(Optional)</span>
          </label>
          <p className="text-xs text-text-muted">
            Add any specific copy, words to use, product details, or offer information you want to include in the listicle.
          </p>
          <textarea
            id="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            disabled={loading}
            placeholder="E.g., Include 'Over 1,000,000 customers have switched', use CTA 'Claim My 50% Discount', mention our 90-day risk-free trial, highlight celebrity endorsements..."
            rows={4}
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading || !url}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              Generate Listicle
              <svg className="w-4 h-4 ml-1.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
