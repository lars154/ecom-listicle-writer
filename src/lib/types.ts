import { z } from 'zod';

// Listicle modes from the blueprint
export const ListicleMode = z.enum([
  'ProblemOrSymptomAwareness',
  'ComparisonOrCategorySwitch',
  'SocialProofOrReasonsToBuy',
  'ExpertOrCelebrityEndorsement',
  'ReviewOrEditorialFirstPerson',
  'KitOrBundleBreakdown',
  'HowToOrRoutine',
  'MythBustingOrEducational',
  'UrgencyOrTrend',
  'MistakeOrDoingItWrong',
  'Hybrid',
  'PersonaOrReasonsToLove',
]);
export type ListicleMode = z.infer<typeof ListicleMode>;

// Base item structure
export const BaseListicleItem = z.object({
  itemNumber: z.number(),
  itemHeadline: z.string(),
  itemBody: z.string(),
  transitionLine: z.string().optional(),
  suggestedVisual: z.string(),
  proofInsert: z.string().optional(),
});

// Mode-specific item extensions
export const MythBustingItem = BaseListicleItem.extend({
  mode: z.literal('MythBustingOrEducational'),
  myth: z.string(),
  truth: z.string(),
  explanation: z.string(),
});

export const HowToItem = BaseListicleItem.extend({
  mode: z.literal('HowToOrRoutine'),
  stepTitle: z.string(),
  instructions: z.string(),
  whyItMatters: z.string(),
});

export const ComparisonItem = BaseListicleItem.extend({
  mode: z.literal('ComparisonOrCategorySwitch'),
  oldWayProblem: z.string(),
  newWayFix: z.string(),
});

export const MistakeItem = BaseListicleItem.extend({
  mode: z.literal('MistakeOrDoingItWrong'),
  mistakeScenario: z.string(),
  consequence: z.string(),
  fix: z.string(),
});

export const ExpertItem = BaseListicleItem.extend({
  mode: z.literal('ExpertOrCelebrityEndorsement'),
  expertQuote: z.string(),
  interpretation: z.string(),
});

export const ReviewItem = BaseListicleItem.extend({
  mode: z.literal('ReviewOrEditorialFirstPerson'),
  experienceMoment: z.string(),
  whatChanged: z.string(),
});

export const ListicleItem = z.discriminatedUnion('mode', [
  MythBustingItem,
  HowToItem,
  ComparisonItem,
  MistakeItem,
  ExpertItem,
  ReviewItem,
  BaseListicleItem.extend({ mode: z.enum([
    'ProblemOrSymptomAwareness',
    'SocialProofOrReasonsToBuy',
    'KitOrBundleBreakdown',
    'UrgencyOrTrend',
    'Hybrid',
    'PersonaOrReasonsToLove',
  ]) }),
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
  categoryHints: z.array(z.string()).optional(), // Keywords that signal product category
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

