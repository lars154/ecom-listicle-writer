import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { ProductBrief, GenerationRequest } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateListicle(
  brief: ProductBrief,
  request: GenerationRequest
): Promise<string> {
  // Load the 3 markdown guides
  const [blueprint, examples, copyGuide] = await Promise.all([
    loadGuide('The Ultimate Listicle Blueprint.md'),
    loadGuide('Example Listicles Copy List.md'),
    loadGuide('How To Write Good Copy For E-Commerce.md'),
  ]);

  // Build the system prompt
  const systemPrompt = buildSystemPrompt(blueprint, copyGuide);

  // Build the user prompt
  const userPrompt = buildUserPrompt(brief, request, examples);

  // Call Claude Opus 4.5
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 16000,
    temperature: 1,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  // Extract markdown text from response
  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return textContent.text;
}

async function loadGuide(filename: string): Promise<string> {
  const guidesPath = join(process.cwd(), '..', filename);
  return await readFile(guidesPath, 'utf-8');
}

function buildSystemPrompt(blueprint: string, copyGuide: string): string {
  return `You are an expert e-commerce copywriter specializing in landing-page listicles. You write conversion-focused, benefit-driven, scannable copy optimized for Replo/Shopify landing pages.

# Your knowledge base

## The Ultimate Listicle Blueprint
${blueprint}

## How To Write Good Copy For E-Commerce
${copyGuide}

# CRITICAL RULES

⚠️ **STAY TRUE TO THE ACTUAL PRODUCT**
- You will receive extracted product information from a real webpage
- Write ONLY about what's explicitly stated in that product brief
- Use the exact terminology and product category from the extracted context
- Never import concepts from a different product category
- If context is unclear, work with what you have—don't fill gaps with assumptions from unrelated categories

⚠️ **EACH LIST ITEM MUST BE UNIQUE**
- Every numbered reason must cover a DIFFERENT angle (per the Hybrid Listicles guidance: "Structure the list so each reason covers a different angle")
- Don't repeat the same theme across multiple bullets
- Variety and distinct perspectives keep copy fresh, scannable, and readable

⚠️ **ONLY USE REAL SOCIAL PROOF**
- Use ONLY provided testimonials, review snippets, and verified stats from the product brief
- NEVER fabricate fake customer quotes, made-up names, or invented proof
- If real proof isn't available for a section, skip it entirely or use only the verified data provided

# Output requirements

You MUST output well-formatted, beautiful Markdown that's easy to read and copy. Structure it for maximum clarity and usability.

Use clear section headers, bullet points, numbered lists, and formatting to make the copy easy to scan and use.`;
}

function buildUserPrompt(
  brief: ProductBrief,
  request: GenerationRequest,
  examples: string
): string {
  const modeInstructions = request.modes
    .map((mode) => `- ${mode}`)
    .join('\n');

  const socialProofSection = request.socialProof
    ? `\n\n# Social proof assets\n\n${JSON.stringify(request.socialProof, null, 2)}\n\n⚠️ Use ONLY these real testimonials and proof elements as provided. Never fabricate quotes or invent proof.`
    : '\n\n⚠️ NO social proof assets provided. Use only review data from the product brief above (if any). Never invent testimonials or fake quotes.';

  const offerSection = request.offerType
    ? `\n\n# Offer details\n\nOffer: ${request.offerType}\nCTA style: ${request.ctaStyle || 'fun, action-driven (never "Learn More" or "Buy Now")'}\nGuarantee: ${request.guaranteeWording || '30-day money-back guarantee'}`
    : '';

  const additionalInfoSection = request.additionalInfo
    ? `\n\n# Additional context from user\n\n${request.additionalInfo}\n\n⚠️ IMPORTANT: Use this context strategically, but remember - each numbered list item must cover a DIFFERENT angle. Don't repeat the same theme across multiple bullets.`
    : '';

  return `Generate a landing-page listicle using the following context and requirements.

# Product/page context (extracted from ${brief.url})

**Page type**: ${brief.pageType}
**Product Title**: ${brief.title}
**Brand**: ${brief.brand || 'Unknown'}
**Price**: ${brief.price || 'Not specified'}
**Product Description**: ${brief.description || 'None provided'}

${brief.categoryHints && brief.categoryHints.length > 0 ? `**Product Category**: ${brief.categoryHints.join(', ')}\n` : ''}

**Benefits extracted** (${brief.benefits.length} found):
${brief.benefits.map((b, i) => `${i + 1}. ${b}`).join('\n') || 'None found'}

**Claims extracted** (${brief.claims.length} found):
${brief.claims.map((c, i) => `${i + 1}. ${c}`).join('\n') || 'None found'}

${brief.ingredients ? `**Ingredients**: ${brief.ingredients.join(', ')}` : ''}

${brief.specs ? `**Specs**: ${JSON.stringify(brief.specs, null, 2)}` : ''}

${brief.reviews ? `**Reviews**: ${brief.reviews.count || '?'} reviews, ${brief.reviews.rating || '?'} stars` : ''}

${brief.reviews?.snippets ? `**Review snippets**:\n${brief.reviews.snippets.map((s, i) => `${i + 1}. "${s}"`).join('\n')}` : ''}

${brief.faqs ? `**FAQs from page** (${brief.faqs.length}):\n${brief.faqs.map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}` : ''}

# Generation requirements

**Listicle mode(s)**: 
${modeInstructions}

**Number of list items**: ${request.itemCount}

**Funnel stage**: ${request.funnelStage}

**Reading level target**: Grade ${request.readingLevel}

${request.mustSay?.length ? `**Must mention**: ${request.mustSay.join(', ')}` : ''}

${request.mustNotSay?.length ? `**Avoid mentioning**: ${request.mustNotSay.join(', ')}` : ''}

${socialProofSection}

${offerSection}

${additionalInfoSection}

# Your task

Generate a complete landing-page listicle using the blueprint, copy guide, and example patterns below.

## Example patterns for reference (learn from structure and style)
${examples.slice(0, 50000)}

## Output format requirements

Generate clean, well-formatted Markdown with CLEAR SECTIONS using ## headings. Each major section should be easily copyable.

**Required structure:**

## Headline Options
[3-5 numbered headline options with specific promises]

## Subheadline & Introduction
[Subheadline + slippery-slope intro paragraph + CTA options]

## Quick Proof
[Social proof elements - ONLY if real data was provided]

## List Item #1: [Benefit Headline]
[Body copy]
[Visual suggestion]

## List Item #2: [Benefit Headline]
[Body copy]
[Visual suggestion]

[Continue for all list items - each as separate ## section]

## Product Reveal
[Product introduction paragraph + key benefits]

## The Offer
[Offer details + CTA options + risk reversal]

## FAQ
[5-8 Q&A pairs]

## Final CTA
[Recap + social proof line + final CTA]

**Critical formatting rules:**
- Use ## for main section headings (makes them individually copyable)
- Use ### for sub-sections within a section
- Use **bold** for emphasis
- Use - or * for bullet lists
- Use emojis strategically for visual breaks
- Keep it scannable and benefit-driven

Generate now.`;
}

