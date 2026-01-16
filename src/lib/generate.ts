import Anthropic from '@anthropic-ai/sdk';
import type { ProductBrief, GenerationRequest } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Inline guides for serverless compatibility
const LISTICLE_BLUEPRINT = `# The Ultimate Listicle Blueprint

## Why Listicles Work
Listicles are the most flexible, shareable, and conversion-friendly format in digital marketing.

They work because they:
- **Create commitment:** If you read #1, you'll read #2 (Zeigarnik Effect)
- **Are scannable:** Perfect for mobile and short attention spans
- **Feel educational:** They teach, not just sell
- **Build trust:** Use testimonials, expert quotes, and customer counts
- **Are versatile:** Use them for problem awareness, solution comparison, product differentiation, or direct sales

## Anatomy of a High-Converting Listicle
1. **Numbered Headline** - Use a number and a clear promise
2. **Short, Relatable Introduction** - Open with a pain, question, or scenario
3. **Numbered List Items** - Each with a clear headline, 2–3 sentences, and a relevant image
4. **Social Proof Throughout** - After a key reason, add a testimonial, star rating, or customer count
5. **Product Introduction** - After 3–5 reasons, introduce your product as the answer
6. **Offer/CTA** - State your offer with specific CTA
7. **FAQ Section** - Answer 5–8 common questions or objections
8. **Final CTA and Recap** - Recap the main benefit, restate the offer

## Listicle Types
- Problem/Symptom Awareness: "5 Signs You Need..."
- Comparison: "10 Reasons to Ditch X For Y"
- Social Proof: "5 Reasons 1,000,000+ People Made The Switch"
- Expert Endorsement: "5 Reasons Why [Expert] Loves [Product]"
- First-Person Review: "I Tried [Product]—Here's My Honest Review"
- Kit/Bundle: "5 Reasons Why This Kit Is a Must-Have"
- How-To/Routine: "How to [Result] in X Steps"
- Myth-Busting: "7 Myths About [Category]"
- Urgency/Trend: "7 Reasons to Try [Product] Before [Event]"
- Mistakes: "5 Mistakes You're Making With [Category]"
- Hybrid: Mix and match multiple ANGLES within list items, BUT the headline TYPE determines the narrative voice throughout

## Hybrid Listicle Rules
- Pick two or more types (e.g., social proof + comparison + feature/benefit)
- Structure the list so each reason covers a different angle
- CRITICAL: The HEADLINE determines the NARRATIVE FRAME for all content
  - First-person headline = first-person experience content
  - Symptom headline = second-person pain point content
  - You can mix benefit angles, but NOT narrative voices`;

const COPY_GUIDE = `# How To Write Good Copy For E-Commerce

## Core Principles
- **Benefits over features:** Don't say "Made with premium materials" say "Feels luxurious on your skin"
- **Specific over vague:** Don't say "Fast results" say "See results in 14 days"
- **Conversational tone:** Write like you're talking to a friend
- **Scannable format:** Short paragraphs, bullet points, bold key phrases

## Key Rules
- Make CTAs fun: Never use "Learn more" or "Buy Now" - use "Pick my color" or "Claim My Discount"
- Keep copy short and punchy with brief sentences and simple words
- Use active voice: "Our serum clears acne fast" not "acne is cleared by our serum"
- Write like you talk with a conversational tone
- Leverage social proof with customer testimonials and reviews
- Address objections upfront
- Create urgency with deadlines or limited availability
- Hook them with a question or relatable problem

## AIDA Framework
- **Attention:** Grab their attention with a compelling headline
- **Interest:** Build interest with benefits and stories
- **Desire:** Create desire with social proof and specific outcomes
- **Action:** Clear CTA telling them exactly what to do

## The Slippery Slope
The goal of your first sentence: get people to read the second sentence.
Readers will keep reading in proportion to the amount they've already read.`;

const EXAMPLE_PATTERNS = `# Example Listicle Patterns

## Pattern 1: Problem/Symptom Awareness
Headline: "5 Signs You Need to Add [Product] to Your Routine"
List items (second-person, symptom-focused):
- "You Feel Tired All the Time"
- "Your Muscles Are Sore and Your Recovery Is Slow"
- "You're Not Seeing Results Despite Trying Everything"
Voice: "You might be...", "If you're experiencing...", "You've probably noticed..."

## Pattern 2: First-Person Review
Headline: "I Tried [Product] – Here's My Honest Review"
List items (first-person, experience-driven):
- "It Helped Beat the Bloat"
- "No More Mid-Day Crashes"
- "I'm Focused AF"
- "It Replaces a Countertop Full of Supplements"
Voice: "I noticed...", "For me...", "My experience was..."

## Pattern 3: Social Proof
Headline: "X Reasons [Number] People Made the Switch"
List items (benefit-driven with proof):
- "Proven Results Backed by 22,000+ Reviews"
- "Made with [Quality Ingredient] – the Gold Standard"
- "Join the Community That's Made 100 Million Coffees"
Voice: Third-person authority with testimonials

## Pattern 4: Expert Endorsement
Headline: "5 Reasons Why [Expert Name] Loves [Product]"
List items (expert-quoted):
- "It's Made with [Quality Ingredient]" – with expert quote
- "It Fits My Clients' Busy Lifestyles" – with expert explanation
Voice: Expert-driven with quotes

## Pattern 5: Hybrid (IMPORTANT)
You can MIX benefit angles (social proof + comparison + features) BUT:
- The HEADLINE determines the NARRATIVE VOICE
- First-person headline = ALL content is first-person experience
- Symptom headline = ALL content addresses reader pain
- WRONG: First-person headline with symptom content ("I Tried..." → "You Feel Tired...")
- RIGHT: First-person headline with varied first-person benefits ("I Tried..." → "It Gave Me Energy", "It Simplified My Routine")`;

export async function generateListicle(
  brief: ProductBrief,
  request: GenerationRequest
): Promise<string> {
  // Check if API key is set
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  
  // Use inline guides for serverless compatibility
  const blueprint = LISTICLE_BLUEPRINT;
  const examples = EXAMPLE_PATTERNS;
  const copyGuide = COPY_GUIDE;

  // Build the system prompt
  const systemPrompt = buildSystemPrompt(blueprint, copyGuide);

  // Build the user prompt
  const userPrompt = buildUserPrompt(brief, request, examples);

  // Call Claude Opus 4.5 with retry logic
  let response;
  let lastError;
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await anthropic.messages.create({
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
      break; // Success, exit retry loop
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.status, error.message);
      
      // If it's an overload error and we have retries left, wait and try again
      if (error.status === 529 && attempt < 3) {
        const waitTime = attempt * 2000; // 2s, 4s
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // For other errors or last attempt, throw
      if (attempt === 3) {
        if (error.status === 529) {
          throw new Error('Anthropic API is currently overloaded. Please try again in a few moments.');
        }
        throw error;
      }
    }
  }
  
  if (!response) {
    throw lastError || new Error('Failed to get response from Claude');
  }

  // Extract markdown text from response
  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return textContent.text;
}


function buildSystemPrompt(blueprint: string, copyGuide: string): string {
  return `You are an expert e-commerce copywriter specializing in landing-page listicles. You write conversion-focused, benefit-driven, scannable copy optimized for Replo/Shopify landing pages.

# Your knowledge base

## The Ultimate Listicle Blueprint
${blueprint}

## How To Write Good Copy For E-Commerce
${copyGuide}

# CRITICAL RULES

⚠️ **HEADLINE AND CONTENT MUST MATCH (MOST IMPORTANT)**
The headline sets the NARRATIVE FRAME for the entire listicle. The content MUST stay within that frame:

1. **First-Person/Review Headlines** → First-Person Content
   - Headline: "I Tried [Product]—Here's My Honest Review"
   - Content: Personal experience items ("It Helped Beat the Bloat", "No More Mid-Day Crashes", "I'm Focused AF")
   - Voice: "I noticed...", "For me...", "My experience was..."
   
2. **Problem/Symptom Headlines** → Second-Person Pain Content
   - Headline: "5 Signs You Need to Add [Product] to Your Routine"
   - Content: Symptom items ("You Feel Tired All the Time", "Your Muscles Are Sore")
   - Voice: "You might be...", "If you're experiencing...", "You've probably noticed..."
   
3. **Social Proof Headlines** → Benefit/Community Content
   - Headline: "5 Reasons 1,000,000+ People Made The Switch"
   - Content: Benefit-driven reasons with testimonials/stats
   - Voice: Third-person authority with proof
   
4. **Expert Headlines** → Expert-Quoted Content
   - Headline: "5 Reasons Why [Expert] Loves [Product]"
   - Content: Expert quotes and credibility-driven reasons

**FOR HYBRID LISTICLES:** You CAN mix different benefit angles (social proof + comparison + features) within the list items, BUT the HEADLINE determines the overall narrative voice. A first-person headline MUST have first-person content. A symptom-awareness headline MUST address reader pain points. Never mix a first-person headline with problem/symptom content or vice versa.

⚠️ **STAY TRUE TO THE ACTUAL PRODUCT**
- You will receive extracted product information from a real webpage
- Write ONLY about what's explicitly stated in that product brief
- Use the exact terminology and product category from the extracted context
- Never import concepts from a different product category
- If context is unclear, work with what you have—don't fill gaps with assumptions from unrelated categories

⚠️ **HEADLINES MUST BE SPECIFIC AND DESCRIPTIVE**
- Every headline MUST include the product name OR specific category/problem it solves
- Headlines must clearly communicate the value proposition—readers should know what problem this product addresses
- NEVER use vague headlines like "I finally found something that helped" or "This changed everything"
- Instead: "I Tried [Specific Product]—Here's My Honest Review" or "5 Reasons This [Category] Supplement Eased My [Specific Problem]"
- The headline should pass this test: "If someone only read the headline, would they know what product/category this is about?"

⚠️ **EACH LIST ITEM MUST BE UNIQUE**
- Every numbered reason must cover a DIFFERENT angle (per the Hybrid Listicles guidance: "Structure the list so each reason covers a different angle")
- Don't repeat the same theme across multiple bullets
- Variety and distinct perspectives keep copy fresh, scannable, and readable

⚠️ **ONLY USE REAL SOCIAL PROOF**
- Use ONLY provided testimonials, review snippets, and verified stats from the product brief
- NEVER fabricate fake customer quotes, made-up names, or invented proof
- If real proof isn't available for a section, skip it entirely or use only the verified data provided

⚠️ **SOCIAL PROOF PLACEMENT (FLEXIBLE)**
- Per the blueprint: "After a key reason, add a testimonial, star rating, or customer count"
- Social proof can appear in multiple ways—use what fits the listicle naturally:
  - **Quick Proof section**: Review counts, star ratings, badges (e.g., "22,000+ Five-Star Reviews")
  - **As a dedicated list item**: e.g., "Join the community that's made over 100 MILLION coffees" or "Great reviews and 30-Day Money Back Guarantee"
  - **Within other list items**: Sprinkle testimonials or stats after key points
  - **Final CTA section**: Testimonial quote or customer count
- Social proof as a list item is optional—it can be its own reason OR woven into other sections. Use judgment based on the listicle flow and available proof.

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

  // Check if Review/First-Person mode is selected
  const isFirstPersonMode = request.modes.includes('ReviewOrEditorialFirstPerson');
  const firstPersonInstructions = isFirstPersonMode
    ? `\n\n# ⚠️ First-Person/Review Listicle Requirements

Since you're writing a FIRST-PERSON/REVIEW listicle:

1. **HEADLINES MUST BE SPECIFIC**: Follow the blueprint pattern: "I Tried [Product Name] – Here's My Honest Review" or reference broader buzz like "I Tried the [Product] Everyone's Talking About"
   - BAD: "I finally found something that helped" (too vague, no product/category)
   - GOOD: "I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review"

2. **LIST ITEMS ARE EXPERIENCE-DRIVEN**: Each list item should be a personal experience/benefit (e.g., "It Helped Beat the Bloat", "No More Mid-Day Crashes", "I'm Focused AF")
   - WRONG: "You Feel Tired All the Time" (this is symptom-awareness, not first-person)
   - RIGHT: "It Gave Me Steady Energy All Day" (personal experience)

3. **SOCIAL PROOF IS FLEXIBLE**: Social proof can validate the personal narrative in various ways:
   - As its own list item (e.g., "Join the community of 100,000+ customers")
   - In the Quick Proof section (review counts, star ratings)
   - In the Final CTA section
   - Woven into other list items as supporting evidence
   - Use what feels natural for the flow—not every first-person listicle needs a dedicated social proof list item`
    : '';

  // Check if hybrid mode is selected
  const isHybridMode = request.modes.includes('Hybrid');
  const hybridModeInstructions = isHybridMode
    ? `\n\n# ⚠️ HYBRID MODE: Mix Multiple Angles, But Keep Voice Consistent

You are writing a HYBRID listicle that combines multiple angles. CRITICAL RULES:

1. **CHOOSE ONE HEADLINE TYPE FIRST**: The headline determines the narrative frame for the ENTIRE listicle
   - First-person headline ("I Tried...") → ALL list items must be personal experiences
   - Symptom headline ("5 Signs You Need...") → ALL list items must address reader pain points
   - Social proof headline ("Why 1M+ People...") → list items should be benefit-driven with proof
   - Comparison headline ("X Reasons to Ditch...") → list items compare old vs new solution

2. **MIX BENEFIT ANGLES WITHIN THAT FRAME**:
   - CORRECT: First-person headline → personal experiences covering social proof, features, benefits, comparison angles
     - "I Joined 100,000+ Happy Customers" (social proof in first-person)
     - "It Replaced My Entire Supplement Cabinet" (comparison in first-person)
     - "The Quality Blew Me Away" (feature in first-person)
   - CORRECT: Symptom headline → different symptoms/problems the reader experiences
   - WRONG: First-person headline with symptom content ("I Tried..." → "You feel tired all the time")

3. **VARIETY IN ANGLES, CONSISTENCY IN VOICE**:
   - Each list item can cover a different angle (social proof, comparison, features, benefits)
   - But ALL items must use the same narrative voice set by the headline`
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
${firstPersonInstructions}
${hybridModeInstructions}

# Your task

Generate a complete landing-page listicle using the blueprint, copy guide, and example patterns below.

## Example patterns for reference (learn from structure and style)
${examples.slice(0, 20000)}

## Output format requirements

Generate clean, well-formatted Markdown with CLEAR SECTIONS using ## headings. Each major section should be easily copyable.

**Required structure:**

## Headline Options
[3-5 numbered headline options - EACH must include the product name or specific category/problem. No vague headlines like "This changed everything."]

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
[Recap + social proof line (testimonial, customer count, or star rating if available) + final CTA]

**Critical formatting rules:**
- Use ## for main section headings (makes them individually copyable)
- Use ### for sub-sections within a section
- Use **bold** for emphasis
- Use - or * for bullet lists
- Use emojis strategically for visual breaks
- Keep it scannable and benefit-driven

Generate now.`;
}

