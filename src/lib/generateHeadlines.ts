import Anthropic from '@anthropic-ai/sdk';
import type { ProductBrief, GenerationRequest, HeadlineOption, ListicleMode } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Pattern guidance for each listicle type
const HEADLINE_PATTERNS: Record<ListicleMode, { name: string; patterns: string[]; guidance: string }> = {
  ProblemOrSymptomAwareness: {
    name: 'Problem/Symptom Awareness',
    patterns: [
      '"5 Signs You Need to Add Creatine to Your Daily Routine"',
      '"10 Reasons You\'re Not Lazy, You\'re Just Breathing Wrong"',
      '"7 Warning Signs Your Sleep Quality Is Affecting Your Health"',
      '"5 Signs Your Skincare Routine Is Actually Making Things Worse"',
      '"8 Symptoms That Mean Your Gut Health Needs Attention"',
    ],
    guidance: `Generate headlines that:
- Focus on SYMPTOMS or SIGNS the reader experiences
- Frame around problems they recognize in themselves
- Use "Signs You..." or "Reasons You're..." or "Why You..." formats
- Make the reader think "that's me!" when they read it
- Connect symptoms to an underlying issue the product solves`,
  },
  ComparisonOrCategorySwitch: {
    name: 'Comparison/Category Switch',
    patterns: [
      '"10 Reasons to Ditch Drugstore Deodorant for Sweat Care"',
      '"8 Reasons Why Everyone Is Replacing Their Old Bedding with This Grounding Mattress Cover"',
      '"7 Reasons to Switch from Regular Coffee to High-Protein Coffee"',
      '"5 Reasons Smart Homeowners Are Ditching Traditional Cookware"',
      '"10 Reasons Athletes Are Switching from Whey to Plant Protein"',
    ],
    guidance: `Generate headlines that:
- Contrast the OLD way vs the NEW/BETTER way
- Use "Ditch X for Y" or "Switch from X to Y" or "Replace X with Y" formats
- Name the inferior category being replaced
- Position the product as the superior alternative
- Imply a movement or trend toward the better option`,
  },
  SocialProofOrReasonsToBuy: {
    name: 'Social Proof/Reasons to Buy',
    patterns: [
      '"5 Reasons 1,000,000+ Home Chefs Are Making The Switch To HexClad"',
      '"7 Reasons Why Thousands of Women Over 40 Swear By This Serum"',
      '"10 Reasons This Has Become America\'s #1 Selling Sleep Aid"',
      '"5 Reasons 500,000+ Customers Gave This 5 Stars"',
      '"8 Reasons Why Everyone Is Obsessed with This Anti-Aging Treatment"',
    ],
    guidance: `Generate headlines that:
- Lead with NUMBERS (customer count, review count, sales figures)
- Use "X+ [audience] Are..." or "Why X People..." formats
- Create FOMO through mass adoption
- Reference ratings, rankings, or bestseller status
- Make the reader feel they're missing out on something proven`,
  },
  ExpertOrCelebrityEndorsement: {
    name: 'Expert/Celebrity Endorsement',
    patterns: [
      '"5 Reasons Why Movie Star Scott Eastwood IS OBSESSED WITH Laundry Sauce"',
      '"5 Reasons Why Fitness Coach Kelsey Heenan Loves Create"',
      '"7 Reasons Why Top Dermatologists Recommend This Sunscreen"',
      '"10 Reasons Why Sleep Scientists Are Obsessed with This Mattress"',
      '"5 Reasons Why Pro Athletes Trust This Recovery Tool"',
    ],
    guidance: `Generate headlines that:
- Feature a credible AUTHORITY figure (expert, celebrity, professional)
- Use "[Expert] Loves/Recommends/Is Obsessed With" format
- If no specific celebrity, use credible authority types (Dermatologists, Sleep Scientists, Pro Athletes)
- Focus on WHY the expert endorses it
- Leverage borrowed credibility`,
  },
  ReviewOrEditorialFirstPerson: {
    name: 'First-Person Review',
    patterns: [
      '"I Tried the Grüns Gummies Everyone\'s Talking About – Here\'s My Honest Review"',
      '"I Tested This Viral Skincare Product for 30 Days – Here\'s What Happened"',
      '"I Finally Tried the Coffee Everyone\'s Raving About – Was It Worth the Hype?"',
      '"I Switched to This Deodorant After 10 Years – Here\'s Why I\'m Never Going Back"',
      '"I Was Skeptical About This Sleep Aid Until I Tried It Myself"',
    ],
    guidance: `Generate headlines that:
- Written in FIRST PERSON ("I Tried...", "I Tested...", "I Switched...")
- Promise an HONEST, authentic review experience
- Include time frame or journey element
- Reference buzz/hype if applicable
- Create relatability through personal experience`,
  },
  KitOrBundleBreakdown: {
    name: 'Kit/Bundle Breakdown',
    patterns: [
      '"5 Reasons Why This Exclusive Jones Road Anniversary Kit Is a Must-Have"',
      '"7 Reasons This Starter Kit Has Everything You Need"',
      '"5 Reasons Why This Bundle Is the Best Value in Skincare"',
      '"10 Reasons Why This Complete System Outperforms Individual Products"',
      '"5 Reasons to Get the Full Kit Instead of Buying Separately"',
    ],
    guidance: `Generate headlines that:
- Emphasize the BUNDLE/KIT/SET nature
- Highlight value, completeness, or exclusivity
- Use "Kit," "Bundle," "System," "Set," "Collection" language
- Focus on getting everything you need in one purchase
- Mention exclusivity or limited availability if applicable`,
  },
  HowToOrRoutine: {
    name: 'How-To/Routine',
    patterns: [
      '"How to Transform Your Morning Routine in 5 Simple Steps"',
      '"The 7-Step Skincare Routine Dermatologists Actually Use"',
      '"How to Get Better Sleep Tonight: A Step-by-Step Guide"',
      '"5 Ways to Upgrade Your Laundry Game Without Extra Effort"',
      '"How to Build the Perfect Coffee Ritual in Under 2 Minutes"',
    ],
    guidance: `Generate headlines that:
- Focus on HOW TO achieve a result
- Include steps, process, or routine elements
- Promise a transformation or improvement
- Make it sound achievable and practical
- Reference time savings or simplicity`,
  },
  MythBustingOrEducational: {
    name: 'Myth-Busting/Educational',
    patterns: [
      '"7 Myths About Protein Powder That Are Holding You Back"',
      '"5 Things You\'ve Been Told About Skincare That Are Actually Wrong"',
      '"10 Sleep Myths That Are Ruining Your Rest"',
      '"The Truth About Creatine: 5 Myths Debunked"',
      '"7 Laundry Mistakes You Didn\'t Know You Were Making"',
    ],
    guidance: `Generate headlines that:
- Challenge common MISCONCEPTIONS
- Use "Myths," "Mistakes," "Wrong," "Truth" language
- Position as educational/revelatory
- Make reader question what they thought they knew
- Promise to correct misinformation`,
  },
  UrgencyOrTrend: {
    name: 'Urgency/Trend',
    patterns: [
      '"10 Reasons Why This High-Protein Iced Coffee is the Coolest Beverage Trend of 2025"',
      '"Why This Skincare Ingredient Is Trending Right Now (And Why You Should Care)"',
      '"5 Reasons This Product Keeps Selling Out"',
      '"The Sleep Trend Everyone Will Be Talking About in 2025"',
      '"Why You Need to Try This Before It Sells Out Again"',
    ],
    guidance: `Generate headlines that:
- Create URGENCY or tap into TRENDS
- Reference current year, seasons, or timing
- Use "Trending," "Viral," "Selling Out" language
- Create fear of missing out (FOMO)
- Position product as part of a movement`,
  },
  MistakeOrDoingItWrong: {
    name: 'Mistakes/Doing It Wrong',
    patterns: [
      '"10 Reasons You\'re Not Lazy, You\'re Just Breathing Wrong"',
      '"7 Skincare Mistakes That Are Aging You Faster"',
      '"5 Morning Routine Mistakes That Are Sabotaging Your Energy"',
      '"8 Laundry Mistakes You\'re Probably Making Right Now"',
      '"10 Sleep Mistakes That Explain Why You\'re Always Tired"',
    ],
    guidance: `Generate headlines that:
- Focus on MISTAKES the reader is making
- Reframe their problem as doing something wrong (not their fault)
- Use "Mistakes," "Wrong," "Sabotaging" language
- Promise to reveal what they're doing incorrectly
- Position product as the fix for their mistake`,
  },
  PersonaOrReasonsToLove: {
    name: 'Persona/Reasons to Love',
    patterns: [
      '"12 Reasons Why Javvy Could be the Best Upgrade to Your Morning Routine"',
      '"7 Reasons Busy Moms Love This 2-Minute Coffee Solution"',
      '"5 Reasons Fitness Enthusiasts Are Obsessed with This Protein"',
      '"10 Reasons Night Owls Swear By This Sleep Aid"',
      '"8 Reasons Minimalists Love This All-in-One Skincare"',
    ],
    guidance: `Generate headlines that:
- Speak to a specific PERSONA or audience segment
- Use "Reasons [Persona] Loves..." format
- Identify with reader's lifestyle or identity
- Focus on why THIS type of person specifically benefits
- Create belonging and identification`,
  },
  Hybrid: {
    name: 'Hybrid (Mixed Angles)',
    patterns: [
      '"5 Reasons Why Everyone is Obsessed with This Anti-Aging Treatment"',
      '"10 Signs You Need to Upgrade Your Skincare (And Why Thousands Already Have)"',
      '"I Tried What 1,000,000 Customers Swear By – Here\'s My Honest Take"',
      '"7 Reasons Top Dermatologists and Real Customers Agree on This Serum"',
      '"5 Mistakes You\'re Making (And the Product 500,000+ People Use to Fix Them)"',
    ],
    guidance: `Generate headlines that:
- Combine elements from multiple approaches (social proof + symptom, expert + review, etc.)
- Mix proof types (expert + customer, personal experience + data)
- Layer multiple hooks in one headline
- Create compound intrigue
- Still maintain clarity about what the product is`,
  },
};

export async function generateHeadlines(
  brief: ProductBrief,
  request: GenerationRequest
): Promise<HeadlineOption[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  // Get the selected mode's pattern guidance
  const selectedMode = request.modes[0];
  const patternGuide = HEADLINE_PATTERNS[selectedMode];

  const systemPrompt = `You are an elite e-commerce copywriter specializing in high-converting listicle headlines.

# YOUR TASK

Generate 5 headline variations for a "${patternGuide.name}" listicle.

⚠️ CRITICAL: ALL 5 headlines must be "${patternGuide.name}" headlines. Do NOT mix in other listicle types.

# REAL EXAMPLES OF "${patternGuide.name.toUpperCase()}" HEADLINES

${patternGuide.patterns.map((p, i) => `${i + 1}. ${p}`).join('\n')}

# HOW TO WRITE "${patternGuide.name.toUpperCase()}" HEADLINES

${patternGuide.guidance}

# WHAT MAKES EACH HEADLINE DIFFERENT

Since all 5 headlines must be the same TYPE (${patternGuide.name}), vary them by:
- Focusing on different BENEFITS or features of the product
- Using different PHRASINGS of the same pattern
- Highlighting different PAIN POINTS or desires
- Varying the NUMBER used (5, 7, 10)
- Approaching from different ANGLES within the same type

# QUALITY RULES

1. **ALL SAME TYPE** - Every headline must be a "${patternGuide.name}" headline
2. **PRODUCT-SPECIFIC** - Include actual product category, features, or benefits
3. **NUMBER FIRST** - Start with the number: "5 Reasons..." not "The 5 Reasons..."
4. **NO GENERIC FILLER** - Every word should be specific and earned
5. **USE REAL DATA** - If review count/rating is provided, use it
6. **MATCH REALITY** - Headlines must reflect what the product actually does

# OUTPUT FORMAT

Return ONLY valid JSON:
{
  "headlines": [
    {
      "headline": "The exact headline text",
      "angle": "${patternGuide.name}",
      "description": "What specific benefit/angle this headline emphasizes"
    }
  ]
}

All 5 headlines should have angle: "${patternGuide.name}" since that's the selected type.`;

  // Build rich product context
  const benefitsList = brief.benefits.slice(0, 8).map((b, i) => `${i + 1}. ${b}`).join('\n');
  const claimsList = brief.claims.slice(0, 5).map((c, i) => `${i + 1}. ${c}`).join('\n');
  
  const userPrompt = `Generate 5 "${patternGuide.name}" headlines for this product:

# PRODUCT INFORMATION

**Product Name**: ${brief.title}
**Brand**: ${brief.brand || 'Unknown brand'}
**Product Category**: ${brief.categoryHints?.join(', ') || 'General'}

**Key Benefits**:
${benefitsList || 'Not specified'}

**Product Claims**:
${claimsList || 'Not specified'}

**Product Description**: 
${brief.description?.slice(0, 500) || 'Not available'}

**Social Proof**:
- Review Count: ${brief.reviews?.count ? `${brief.reviews.count.toLocaleString()}+ reviews` : 'Unknown'}
- Average Rating: ${brief.reviews?.rating ? `${brief.reviews.rating}/5 stars` : 'Unknown'}

# REQUIREMENTS

Generate exactly 5 headlines that:
1. Are ALL "${patternGuide.name}" type headlines (the user selected this type)
2. Each focuses on a different BENEFIT or ANGLE of the product
3. Are SPECIFIC to this exact product
4. Use real data from above when available

Return ONLY valid JSON.`;

  let response;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 1,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
      break;
    } catch (error: any) {
      lastError = error;
      if (error.status === 529 && attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        continue;
      }
      if (attempt === 3) throw error;
    }
  }

  if (!response) {
    throw lastError || new Error('Failed to get response from Claude');
  }

  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  // Parse JSON response
  try {
    const parsed = JSON.parse(textContent.text);
    return parsed.headlines as HeadlineOption[];
  } catch {
    // Try to extract JSON from markdown code block
    const jsonMatch = textContent.text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      return parsed.headlines as HeadlineOption[];
    }
    throw new Error('Failed to parse headline options from response');
  }
}
