import { z } from 'zod';

// Listicle modes - consolidated to 5 distinct narrative voices
// These represent fundamentally different content structures, not just topic angles
export const ListicleMode = z.enum([
  // First-person experience narrative: "I Tried X - Here's My Honest Review"
  // Content is personal experience-driven: "It Helped Beat the Bloat", "No More Crashes"
  'FirstPersonReview',
  
  // Second-person pain/symptom narrative: "5 Signs You Need X" / "X Mistakes You're Making"
  // Content addresses reader directly: "You Feel Tired", "Your Recovery Is Slow"
  // Also covers: myth-busting, mistakes, educational content with pain focus
  'ProblemAwareness',
  
  // Third-person authority/proof narrative: "Why 1M+ People Made The Switch" / "Why [Expert] Loves X"
  // Content is benefit-driven with social proof and credibility
  // Also covers: expert endorsement, celebrity, persona-based, reasons to love
  'SocialProofAuthority',
  
  // Direct comparison narrative: "10 Reasons to Ditch X for Y" / "Why Everyone Is Replacing X with Y"
  // Content contrasts old solution problems vs new solution benefits
  'Comparison',
  
  // Mix multiple ANGLES (social proof, features, benefits) within ONE consistent narrative voice
  // The headline determines the voice; content can cover different angles
  'Hybrid',
]);
export type ListicleMode = z.infer<typeof ListicleMode>;

// Base item structure - simplified, works for all modes
export const BaseListicleItem = z.object({
  itemNumber: z.number(),
  itemHeadline: z.string(),
  itemBody: z.string(),
  transitionLine: z.string().optional(),
  suggestedVisual: z.string(),
  proofInsert: z.string().optional(),
});

// Mode-specific item extensions for structured output (optional use)
export const FirstPersonItem = BaseListicleItem.extend({
  mode: z.literal('FirstPersonReview'),
  experienceMoment: z.string().optional(),
  whatChanged: z.string().optional(),
});

export const ProblemAwarenessItem = BaseListicleItem.extend({
  mode: z.literal('ProblemAwareness'),
  painPoint: z.string().optional(),
  consequence: z.string().optional(),
});

export const SocialProofItem = BaseListicleItem.extend({
  mode: z.literal('SocialProofAuthority'),
  proofElement: z.string().optional(),
  credibilitySource: z.string().optional(),
});

export const ComparisonItem = BaseListicleItem.extend({
  mode: z.literal('Comparison'),
  oldWayProblem: z.string().optional(),
  newWayFix: z.string().optional(),
});

export const HybridItem = BaseListicleItem.extend({
  mode: z.literal('Hybrid'),
  angleType: z.string().optional(),
});

export const ListicleItem = z.discriminatedUnion('mode', [
  FirstPersonItem,
  ProblemAwarenessItem,
  SocialProofItem,
  ComparisonItem,
  HybridItem,
]);

export type ListicleItem = z.infer<typeof ListicleItem>;

export const LandingPageBlocks = z.object({
  mode: ListicleMode,
  hero: z.object({
    headlineOptions: z.array(z.string()).min(3).max(5),
    subheadline: z.string(),
    introParagraph: z.string(),
    ctaVariants: z.array(z.string()).min(1).max(3),
  }),
  quickProofRow: z.object({
    reviewCount: z.string().optional(),
    rating: z.string().optional(),
    badges: z.array(z.string()).optional(),
    guarantee: z.string().optional(),
  }),
  items: z.array(ListicleItem).min(3).max(12),
  productReveal: z.object({
    position: z.number(),
    revealParagraph: z.string(),
    benefitBullets: z.array(z.string()).min(3).max(5),
  }),
  offerStack: z.object({
    offerHeadline: z.string(),
    offerDetails: z.string(),
    ctaVariants: z.array(z.string()).min(1).max(3),
    riskReversal: z.string(),
  }),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).min(5).max(8),
  finalCta: z.object({
    recap: z.string(),
    proofLine: z.string(),
    cta: z.string(),
  }),
});

export type LandingPageBlocks = z.infer<typeof LandingPageBlocks>;

// Product brief from URL extraction
export const ProductBrief = z.object({
  url: z.string().url(),
  pageType: z.enum(['product', 'landing', 'unknown']),
  title: z.string(),
  brand: z.string().optional(),
  price: z.string().optional(),
  description: z.string().optional(),
  categoryHints: z.array(z.string()).optional(),
  benefits: z.array(z.string()),
  claims: z.array(z.string()),
  ingredients: z.array(z.string()).optional(),
  specs: z.record(z.string(), z.string()).optional(),
  reviews: z.object({
    count: z.number().optional(),
    rating: z.number().optional(),
    snippets: z.array(z.string()).optional(),
  }).optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
});

export type ProductBrief = z.infer<typeof ProductBrief>;

// Generation request
export const GenerationRequest = z.object({
  url: z.string().url(),
  modes: z.array(ListicleMode).min(1),
  itemCount: z.number().min(3).max(12).default(5),
  funnelStage: z.enum(['awareness', 'consideration', 'conversion']).default('consideration'),
  voice: z.object({
    punchyVsDetailed: z.number().min(0).max(10).default(5),
    playfulVsSerious: z.number().min(0).max(10).default(5),
    boldVsCautious: z.number().min(0).max(10).default(5),
  }).optional(),
  readingLevel: z.number().min(3).max(12).default(6),
  mustSay: z.array(z.string()).optional(),
  mustNotSay: z.array(z.string()).optional(),
  offerType: z.enum(['discount', 'bundle', 'free_gift', 'free_shipping', 'guarantee', 'limited_time']).optional(),
  ctaStyle: z.string().optional(),
  guaranteeWording: z.string().optional(),
  socialProof: z.object({
    reviewCount: z.string().optional(),
    rating: z.string().optional(),
    testimonials: z.array(z.string()).optional(),
    pressMentions: z.array(z.string()).optional(),
    expertName: z.string().optional(),
    expertCredentials: z.string().optional(),
  }).optional(),
  additionalInfo: z.string().optional(),
});

export type GenerationRequest = z.infer<typeof GenerationRequest>;

// Headline option for two-step generation
export const HeadlineOption = z.object({
  headline: z.string(),
  angle: z.string(),
  description: z.string(),
});

export type HeadlineOption = z.infer<typeof HeadlineOption>;

// Response from headline generation
export const HeadlineOptionsResponse = z.object({
  headlines: z.array(HeadlineOption).min(3).max(5),
  brief: ProductBrief,
});

export type HeadlineOptionsResponse = z.infer<typeof HeadlineOptionsResponse>;

// Request for full listicle generation (after headline selection)
export const FullListicleRequest = GenerationRequest.extend({
  selectedHeadline: HeadlineOption,
  brief: ProductBrief.optional(),
});

export type FullListicleRequest = z.infer<typeof FullListicleRequest>;
