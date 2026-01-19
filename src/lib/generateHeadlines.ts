import Anthropic from '@anthropic-ai/sdk';
import type { ProductBrief, GenerationRequest, HeadlineOption, ListicleMode } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Pattern guidance for each of the 5 consolidated listicle types
const HEADLINE_PATTERNS: Record<ListicleMode, { name: string; patterns: string[]; guidance: string }> = {
  FirstPersonReview: {
    name: 'First-Person Review',
    patterns: [
      '"I Tried the Grüns Gummies Everyone\'s Talking About – Here\'s My Honest Review"',
      '"I Finally Fixed My Afternoon Energy Crashes – Here\'s How"',
      '"I Tested This Viral Skincare Product for 30 Days – Here\'s What Happened"',
      '"I Switched to This Deodorant After 10 Years – Here\'s Why I\'m Never Going Back"',
      '"I Was Skeptical About This Sleep Aid Until I Tried It Myself"',
    ],
    guidance: `Generate headlines that:
- Written in FIRST PERSON ("I Tried...", "I Tested...", "I Switched...", "I Finally...")
- Promise an HONEST, authentic review experience
- Include time frame or journey element when relevant
- Reference buzz/hype if applicable ("everyone's talking about", "viral")
- Create relatability through personal experience
- MUST include the product name or specific category (never vague)`,
  },
  ProblemAwareness: {
    name: 'Problem Awareness',
    patterns: [
      '"5 Signs You Need to Add Creatine to Your Daily Routine"',
      '"10 Reasons You\'re Not Lazy, You\'re Just Breathing Wrong"',
      '"7 Warning Signs Your Sleep Quality Is Affecting Your Health"',
      '"5 Mistakes You\'re Making With Your Morning Coffee"',
      '"8 Symptoms That Mean Your Gut Health Needs Attention"',
      '"7 Myths About Protein Powder That Are Holding You Back"',
    ],
    guidance: `Generate headlines that:
- Focus on SYMPTOMS, SIGNS, or MISTAKES the reader experiences
- Frame around problems they recognize in themselves
- Use formats like: "Signs You...", "Reasons You're...", "Mistakes You're Making...", "Myths About..."
- Make the reader think "that's me!" when they read it
- Connect symptoms to an underlying issue the product solves
- Include the product category (never generic phrases like "this product")`,
  },
  SocialProofAuthority: {
    name: 'Social Proof / Authority',
    patterns: [
      '"5 Reasons Why Movie Star Scott Eastwood IS OBSESSED WITH Laundry Sauce"',
      '"5 Reasons 1,000,000+ Home Chefs Are Making The Switch To HexClad"',
      '"5 Reasons Why Fitness Coach Kelsey Heenan Loves Create"',
      '"7 Reasons Why Thousands of Women Over 40 Swear By This Serum"',
      '"10 Reasons Harvard-Endorsed Barefoot Shoes Prevent Foot Surgery"',
      '"Why Everyone Is Obsessed with This Anti-Aging Treatment"',
    ],
    guidance: `Generate headlines that:
- Lead with NUMBERS (customer count, review count, sales figures) OR authority figures
- For celebrity/expert: Use "[Expert] Loves/Recommends/Is Obsessed With" format
- For mass social proof: Use "X+ [audience] Are..." or "Why X People..." formats
- Create FOMO through mass adoption or expert credibility
- Reference ratings, rankings, bestseller status, or expert credentials
- MUST include product/brand name (never "this product")`,
  },
  Comparison: {
    name: 'Comparison',
    patterns: [
      '"10 Reasons to Ditch Drugstore Deodorant for Sweat Care"',
      '"8 Reasons Why Everyone Is Replacing Their Old Bedding with This"',
      '"6 Reasons To Toss The Floss & Start Flausing"',
      '"7 Reasons to Switch from Regular Coffee to High-Protein Coffee"',
      '"5 Reasons Smart Homeowners Are Ditching Traditional Cookware"',
    ],
    guidance: `Generate headlines that:
- Contrast the OLD way vs the NEW/BETTER way
- Use "Ditch X for Y" or "Switch from X to Y" or "Replace X with Y" formats
- Name the inferior category being replaced
- Position the product as the superior alternative
- Imply a movement or trend toward the better option
- MUST include both old and new solution references`,
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
- IMPORTANT: Still maintain ONE clear narrative voice
- MUST include product name or specific category`,
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
- Approaching from different ANGLES within the same type

⚠️ IMPORTANT: The user has selected ${request.itemCount} list items. ALL headlines that include a number MUST use "${request.itemCount}" (e.g., "${request.itemCount} Reasons...", "${request.itemCount} Signs..."). Do NOT use any other number.

# QUALITY RULES

1. **ALL SAME TYPE** - Every headline must be a "${patternGuide.name}" headline
2. **PRODUCT-SPECIFIC** - Include actual product name, brand, or category
3. **NUMBER FIRST** - Start with the number: "5 Reasons..." not "The 5 Reasons..."
4. **NO GENERIC FILLER** - Every word should be specific and earned
5. **USE REAL DATA** - If review count/rating is provided, use it
6. **MATCH REALITY** - Headlines must reflect what the product actually does

# ❌ BAD HEADLINES (NEVER GENERATE THESE)

- "I finally found something that helped" (no product, too vague)
- "This changed everything" (no specificity)
- "The best product I've tried" (generic, no product name)
- "5 Reasons to Try This Amazing Product" (generic)
- "Why I Love This" (no context)
- "X Things You Need to Know" (vague)

# OUTPUT FORMAT

Return ONLY valid JSON:
{
  "headlines": [
    {
      "headline": "The exact headline text WITH product name",
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

**Number of list items**: ${request.itemCount}
⚠️ ALL headlines with numbers MUST use ${request.itemCount} (e.g., "${request.itemCount} Reasons...", "${request.itemCount} Signs...")

⚠️ CRITICAL: Every headline MUST include "${brief.brand || brief.title}" or specific category like "${brief.categoryHints?.[0] || 'the product type'}". Never use generic phrases like "this product" or "something that helped".

Generate exactly 5 headlines that:
1. Are ALL "${patternGuide.name}" type headlines (the user selected this type)
2. Use ${request.itemCount} as the number in numbered headlines
3. Each focuses on a different BENEFIT or ANGLE of the product
4. Are SPECIFIC to this exact product
5. Use real data from above when available

Return ONLY valid JSON.`;

  let response;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.7, // Lowered from 1 for more consistent quality
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
    const jsonMatch = textContent.text.match(/\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      return parsed.headlines as HeadlineOption[];
    }
    throw new Error('Failed to parse headline options from response');
  }
}
