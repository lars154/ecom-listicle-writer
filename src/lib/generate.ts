import Anthropic from '@anthropic-ai/sdk';
import type { ProductBrief, GenerationRequest, HeadlineOption, FullListicleRequest } from './types';

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
2. **Short, Relatable Introduction** - Open with a pain, question, or scenario your reader recognizes
3. **Numbered List Items** - Each with a clear headline, 2–3 sentences, and a relevant image
4. **Social Proof Throughout** - After a key reason, add a testimonial, star rating, or customer count
5. **Product Introduction** - After 3–5 reasons, introduce your product as the answer with a "diagnosis" moment
6. **Offer/CTA** - State your offer with specific CTA
7. **FAQ Section** - Answer 5–8 common questions or objections
8. **Final CTA and Recap** - Recap the main benefit, restate the offer

---

## The 5 Listicle Types (Narrative Voices)

These are FUNDAMENTALLY DIFFERENT content structures based on narrative voice:

### 1. FirstPersonReview
**Headline patterns:**
- "I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review"
- "I Finally Fixed My Afternoon Energy Crashes – Here's How"

**Content voice:** First-person experience
- List items: "It Helped Beat the Bloat", "No More Mid-Day Crashes", "I'm Focused AF"
- Language: "I noticed...", "For me...", "My experience was...", "Since starting..."

### 2. ProblemAwareness
**Headline patterns:**
- "5 Signs You Need to Add Creatine to Your Daily Routine"
- "10 Reasons You're Not Lazy, You're Just Breathing Wrong"
- "5 Mistakes You're Making With Your Morning Coffee"
- "7 Myths About [Category] Exposed"

**Content voice:** Second-person pain/symptom focus
- List items: "You Feel Tired All the Time", "Your Recovery Is Slow", "You're Doing It Wrong"
- Language: "You might be...", "If you're experiencing...", "You've probably noticed..."

### 3. SocialProofAuthority
**Headline patterns:**
- "5 Reasons 1,000,000+ Home Chefs Are Making The Switch To HexClad"
- "5 Reasons Why Movie Star Scott Eastwood IS OBSESSED WITH Laundry Sauce"
- "5 Reasons Why Fitness Coach Kelsey Heenan Loves Create"
- "Why Everyone Is Obsessed with This Anti-Aging Treatment"

**Content voice:** Third-person authority with proof
- List items: Benefit-driven with testimonials, stats, expert credibility
- Language: Authority statements, social proof, endorsements

### 4. Comparison
**Headline patterns:**
- "10 Reasons to Ditch Drugstore Deodorant for Sweat Care"
- "8 Reasons Why Everyone Is Replacing Their Old Bedding with This"
- "6 Reasons To Toss The Floss & Start Flausing"

**Content voice:** Old way vs new way contrast
- List items: Problem with old solution → How new solution fixes it
- Language: "Unlike...", "Instead of...", "Say goodbye to..."

### 5. Hybrid
**Rules for Hybrid:**
- Pick ONE headline type from above - this sets the narrative voice
- Mix multiple ANGLES within that voice (social proof + features + benefits)
- WRONG: First-person headline with "You feel tired" content
- RIGHT: First-person headline with "I joined 100,000+ customers" (social proof IN first-person)

---

## HOW TO WRITE: Subheadline & Introduction

### Subheadline Patterns:
- **Problem + Promise + Incentive:** "Learn how to [identify problem/get result] and if [Product] is right for you - plus, save [X]% to try for yourself!"
- **Expert + Promise:** "[Expert name/title] recommends [Product] to everyone - learn why, plus save [X]%!"
- **Curiosity Hook:** "Read this BEFORE your [next coffee run/next purchase/etc]!"
- **Authority + Tease:** "As a [role], I [context]. Here's what I found..."

### Introduction Structure (The Slippery Slope):
1. **Open with pain, question, or relatable scenario**
2. **Validate with empathy** - "You're not alone."
3. **Optional stat or proof** - Ground it in reality
4. **Tease the list** - "Here's what's really going on..."

---

## HOW TO WRITE: Each List Item

Each numbered item should:
1. **Clear headline** - Numbered, bolded, specific benefit or symptom
2. **"You" scenario OR personal experience** (match the listicle type)
3. **Simple explanation** - Why it matters or what causes it
4. **Agitate the pain OR show the benefit** - Make them feel it
5. **Visual suggestion** - Product in use, before/after, or person experiencing the problem
6. **Transition** - Bridge to next item naturally

---

## HOW TO WRITE: Product Reveal Section

**TIMING:** After 3-5 list items, introduce the product as the natural "answer."

**Structure:**
1. **Transition sentence** - "It's never been easier to see the difference for yourself."
2. **Product introduction** - Position as the solution to everything discussed
3. **3-5 bullet benefits** - Key product differentiators
4. **Social proof moment** - Customer count, testimonial, or rating

---

## HOW TO WRITE: The Offer/CTA Section

**Structure:**
1. **Offer headline** - "UP TO [X]% OFF FOR A LIMITED TIME ONLY!"
2. **Urgency element** - Timer, limited stock, or deadline
3. **Value stack** - List everything they get
4. **CTA button** - Action-driven, specific (never "Learn More")
5. **Risk reversal** - Money-back guarantee, free trial`;

const COPY_GUIDE = `# How To Write Good Copy For E-Commerce

## Core Principles
- **Benefits over features:** Don't say "Made with premium materials" say "Feels luxurious on your skin"
- **Specific over vague:** Don't say "Fast results" say "See results in 14 days"
- **Conversational tone:** Write like you're talking to a friend
- **Scannable format:** Short paragraphs, bullet points, bold key phrases

## The Slippery Slope (CRITICAL)
The goal of your first sentence is to get people to read the second sentence.
The goal of the third: get people to read the fourth. And so on.
Readers will keep reading in proportion to the amount they've already read. And the more they read, the more they'll agree with you.

**The best sales copy is like a slippery slope that you slowly fall down. The words suck you right in.**

## AIDA Framework
- **Attention:** Compelling headline with a clear promise
- **Interest:** Build with benefits, stories, and relatable scenarios
- **Desire:** Create with social proof and specific outcomes
- **Action:** Clear CTA telling them exactly what to do

## Pain is the Pitch (Alex Hormozi)
Two persuasion weapons: Promise (more good stuff) and Pain (less bad stuff).
Make an offer at the point of greatest DEPRIVATION, not greatest satisfaction.

**How to Write Pain-Based Copy:**
1. Capture SPECIFIC painful moments - not "she was overweight" but "She wore a coverall to the beach. She got chafing between her thighs walking all day."
2. Use THEIR language - describe the pain in the exact words your prospect uses
3. The more specific you are, the more credible you become

> "If you can accurately describe a prospect's pain in their own language, you can persuade them to buy whatever your product is."

## The Yes Ladder
A person who's said yes to a small request first is more likely to say yes to a bigger request later.
Get people to say yes early and often in your copy - and they're more likely to say yes to buying.

How? EMPATHY and SPECIFIC KNOWLEDGE. Know why people are frustrated. Put yourself in the customer's shoes. Find what motivates them, what they dislike, and the root emotion that'll make them buy.

## Writing Style Rules
- **Short words, short sentences:** Maximum comprehension. Write at 6th grade level.
- **Use active voice:** "Our serum clears acne fast" not "acne is cleared by our serum"
- **Write like you speak:** Conversational tone as if chatting with a friend
- **No adverbs:** Find a better verb instead
- **Rhythm:** Short, short, long. Give your writing flow.
- **Be specific with numbers:** "6-part framework" not "a framework"

## CTA Rules
Never use "Learn more" or "Buy Now" - use action-driven CTAs that tell them what happens next:
- "Pick my color" or "Claim My Discount"
- "Start Here" or "See the Difference"
- "Check Availability" or "Get My [X]% Off"

## Storytelling Sells
Storytelling is an amazing way to grab attention and create a slippery slope.
Starting a sales letter with a story... and THEN selling... is a great format.
Story = Attention + Interest, then explain the offer (Desire) and tell the Action.`;

const EXAMPLE_PATTERNS = `# Example Listicle Patterns (REAL headlines from high-converting listicles)

## Pattern 1: ProblemAwareness
**Headline:** "5 Signs You Need to Add Creatine to Your Daily Routine"
**Subheadline:** "Learn how to identify if you need to take creatine and if Create's gummies are the right choice for you - plus, save up to 50% to try for yourself!"

**List items (second-person, symptom-focused):**
1. "You feel tired all the time" → "Tired, even after a full night's sleep? You might be low on cellular energy. Creatine helps replenish ATP, your body's main energy source, to keep you going strong."
2. "Your muscles are sore and your recovery is slow" → "Sore muscles slowing you down? Creatine supports muscle hydration and repair, helping reduce soreness and inflammation."
3. "Your workouts feel flat and sluggish" → "Your muscles might be low on quick-access energy. Creatine boosts ATP production, giving you the power, strength, and endurance to push past limits."
4. "You have daily brain fog" → "Your brain runs on energy too—and creatine helps power it. By boosting brain energy metabolism, creatine supports focus, memory, and mental clarity."

---

## Pattern 2: FirstPersonReview
**Headline:** "I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review"
**Subheadline:** "As a beauty writer, former dancer, and mom of two, I eat clean, whole foods and try to stay consistent with my wellness routine. But despite my nutrient-rich diet, I learned the hard way: modern diets actually aren't cutting it."

**List items (first-person, experience-driven):**
1. "It Helped Beat the Bloat" → "I eat clean, but bloat still creeps in sometimes. Since starting Grüns, I've noticed my digestion is way more regular and my stomach feels flatter throughout the day."
2. "No More Mid-Day Crashes" → "I work from home, which means I'm extra vulnerable to the dreaded afternoon slump. Before Grüns, I'd crash after lunch. Now? No slump. No caffeine crash. Just steady, sustained energy."
3. "I'm Focused AF" → "Between laundry, dishes, ballet signups, and writing deadlines, mental clarity is everything and Grüns delivers."
4. "It Replaces a Countertop Full of Supplements" → "I used to rotate between packets, pills, powders, and even pricey mushroom drinks. Grüns simplified all of it."

---

## Pattern 3: SocialProofAuthority (Celebrity/Expert)
**Headline:** "5 Reasons Why Movie Star Scott Eastwood IS OBSESSED WITH Laundry Sauce"
**Subheadline:** "Learn why Scott Eastwood, certified movie star and your hall pass, recommends these luxury laundry pods to everyone and uses them himself - plus save up to 35% and get 4 FREE gifts!"

**List items (expert-credibility driven):**
1. "Their Bio-Enzyme Technology® Fights Stains Like a Movie Stunt Double" → "Scott's clothes face everything from action sequences to romantic scenes, and bio-enzyme technology handles it all."
2. "Their fragrances are crafted by the world's top perfumers" → "Laundry Sauce works with world's top perfumers to create high-end luxury fragrances."
3. "Scents Last 1-2 Weeks on Garments" → "Scott humorously complains about his clothes smelling so good that Hollywood want his every scene to be a love scene."

---

## Pattern 4: SocialProofAuthority (Mass Numbers)
**Headline:** "5 Reasons 1,000,000+ Home Chefs Are Making The Switch To HexClad"

**List items (benefit-driven with proof):**
1. "Cook an entire meal with one pan" → "HexClad's hybrid design lets you effortlessly transition from stovetop to oven, simplifying meal prep and reducing the pile-up in your sink."
2. "Effortless cleanup" → "Say goodbye to scrubbing and soaking! HexClad's advanced nonstick surface allows for quick and easy cleanup."
3. "Perfect Heat Distribution" → "HexClad's patented hybrid technology prevents hot spots and ensures even cooking."
4. "Trusted and used by Michelin-star chefs worldwide" → "When culinary masters like Gordon Ramsay rely on HexClad, you know it's a game-changer."
5. "Backed by a Lifetime Warranty" → "Our confidence in our cookware is backed by our lifetime warranty."

---

## Pattern 5: Comparison
**Headline:** "10 Reasons to Ditch Drugstore Deodorant for Sweat Care"
**Subheadline:** "Learn about Superior Sweat Defense with Carpe"

**List items (old way vs new way):**
1. "Drugstore deodorants still leave you sweaty and smelly" → "Here's a fun fact: Odor comes from sweat, yet most traditional deodorants don't actually target sweat. Carpe tackles sweat by using sweat-preventing and sweat-absorbing ingredients."
2. "Big deodorant brands don't understand your sweat struggle" → "Sometimes you want to sweat, and sometimes you don't. Carpe's co-Founders know exactly what it's like to sweat more than you want to."
3. "They only have products for the underarms" → "Carpe is leading the charge on innovating new sweat products."
4. "You want to rock any color in your closet" → "To all of those shirts shoved into the back of your closet for fear of sweat stains - it's your time to shine!"

---

## MORE REAL HEADLINE EXAMPLES (learn from these patterns)

**ProblemAwareness:**
- "10 Reasons You're Not Lazy, You're Just Breathing Wrong" (Hostage Tape)
- "If you're always running late, this ONE TOOL will not only replace your razor..." (Nood)
- "How People of All Ages Are Finding Relief from Insomnia & Anxiety" (GlowCo)

**SocialProofAuthority:**
- "5 Reasons Why Fitness Coach Kelsey Heenan Loves Create"
- "6 Reasons WHY millions are switching to the ridge wallet" (The Ridge)
- "5 REASONS WHY THOUSANDS OF WOMEN ARE SWITCHING TO GEL POLISH POPS"
- "5 Reasons Why Everyone is Obsessed with This Anti-Aging Treatment" (Cocunat)
- "10 Reasons Harvard-Endorsed Barefoot Shoes Prevent Foot Surgery" (HIKE)
- "Meet The Revolutionary Electric Flosser Praised by Shark Tank" (Flaus)

**Comparison:**
- "8 Reasons Why Everyone Is Replacing Their Old Bedding with This" (Downtoground)
- "6 Reasons To Toss The Floss & Start Flausing" (Flaus)

**FirstPersonReview:**
- "I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review"

**Other Strong Patterns:**
- "10 seconds. 20g protein. Zero BS." (Javvy - stats punch)
- "YOUR LAUNDRY. REIMAGINED." (Laundry Sauce - bold transformation)
- "The Ultimate Glow Is Easy As 1-2-3" (Ogee - simplicity promise)
- "12 Reasons Why Javvy Could be the Best Upgrade to Your Morning Routine"
- "5 Ways WTF Will Change the Way You Think About Foundation" (Jones Road)

---

## CRITICAL: Headline Requirements

✅ GOOD headlines have:
- Product/brand name OR specific category
- A number (usually)
- A clear angle/promise
- Specificity

❌ BAD headlines (NEVER generate these):
- "I finally found something that helped" (too vague)
- "This changed everything" (no specificity)
- "The best product I've tried" (generic)
- "5 Reasons to Try This Amazing Product" (no product name)
- "Why I Love This" (no context)`;


export async function generateListicle(
  brief: ProductBrief,
  request: GenerationRequest
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  
  const blueprint = LISTICLE_BLUEPRINT;
  const examples = EXAMPLE_PATTERNS;
  const copyGuide = COPY_GUIDE;

  const systemPrompt = buildSystemPrompt(blueprint, copyGuide);
  const userPrompt = buildUserPrompt(brief, request, examples);

  let response;
  let lastError;
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await anthropic.messages.create({
        model: 'claude-opus-4-5-20251101',
        max_tokens: 16000,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });
      break;
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.status, error.message);
      
      if (error.status === 529 && attempt < 3) {
        const waitTime = attempt * 2000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
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

1. **FirstPersonReview Headlines** → First-Person Content
   - Headline: "I Tried [Product]—Here's My Honest Review"
   - Content: Personal experience items ("It Helped Beat the Bloat", "No More Mid-Day Crashes")
   - Voice: "I noticed...", "For me...", "My experience was..."
   
2. **ProblemAwareness Headlines** → Second-Person Pain Content
   - Headline: "5 Signs You Need to Add [Product] to Your Routine"
   - Content: Symptom items ("You Feel Tired All the Time", "Your Muscles Are Sore")
   - Voice: "You might be...", "If you're experiencing..."
   
3. **SocialProofAuthority Headlines** → Benefit/Community Content
   - Headline: "5 Reasons 1,000,000+ People Made The Switch"
   - Content: Benefit-driven reasons with testimonials/stats
   - Voice: Third-person authority with proof
   
4. **Comparison Headlines** → Old vs New Content
   - Headline: "10 Reasons to Ditch X for Y"
   - Content: Problems with old way, how new way solves them
   - Voice: Contrast language ("Unlike...", "Say goodbye to...")

**FOR HYBRID LISTICLES:** You CAN mix different benefit angles within list items, BUT the HEADLINE determines the overall narrative voice.

⚠️ **STAY TRUE TO THE ACTUAL PRODUCT**
- Write ONLY about what's explicitly stated in the product brief
- Use the exact terminology and product category from the extracted context
- Never import concepts from a different product category
- If context is unclear, work with what you have—don't fill gaps with assumptions

⚠️ **HEADLINE QUALITY REQUIREMENTS**

✅ GOOD headlines MUST have:
- Product name OR specific category (not generic)
- A number (in most cases)
- A clear angle/promise
- Specificity that tells you what the listicle is about

❌ BAD headlines to NEVER generate:
- "I finally found something that helped" (too vague, no product)
- "This changed everything" (no specificity)
- "The best product I've tried" (generic)
- "5 Reasons to Try This Amazing Product" (no product name)
- "Why I Love This" (no context)
- "X Things You Need to Know" (vague)

⚠️ **EACH LIST ITEM MUST BE UNIQUE**
- Every numbered reason must cover a DIFFERENT angle
- Don't repeat the same theme across multiple bullets
- Variety and distinct perspectives keep copy fresh and scannable

⚠️ **ONLY USE REAL SOCIAL PROOF**
- Use ONLY provided testimonials, review snippets, and verified stats from the product brief
- NEVER fabricate fake customer quotes, made-up names, or invented proof

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
    ? `\n\n# Additional context from user\n\n${request.additionalInfo}\n\n⚠️ IMPORTANT: Use this context strategically, but remember - each numbered list item must cover a DIFFERENT angle.`
    : '';

  const isFirstPersonMode = request.modes.includes('FirstPersonReview');
  const firstPersonInstructions = isFirstPersonMode
    ? `\n\n# ⚠️ FirstPersonReview Requirements

Since you're writing a FIRST-PERSON/REVIEW listicle:

1. **HEADLINES MUST BE SPECIFIC**: Use product name, category, OR problem-focus:
   - With product: "I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review"
   - With category: "I Tried This High-Protein Iced Coffee – Here's My Honest Review"
   - Problem-focus: "I Finally Fixed My Afternoon Energy Crashes – Here's How"
   - BAD: "I finally found something that helped" (too vague, no context)

2. **LIST ITEMS ARE EXPERIENCE-DRIVEN**: Each list item should be a personal experience/benefit
   - WRONG: "You Feel Tired All the Time" (this is ProblemAwareness, not first-person)
   - RIGHT: "It Gave Me Steady Energy All Day" (personal experience)`
    : '';

  const isHybridMode = request.modes.includes('Hybrid');
  const hybridModeInstructions = isHybridMode
    ? `\n\n# ⚠️ HYBRID MODE: Mix Multiple Angles, But Keep Voice Consistent

1. **CHOOSE ONE HEADLINE TYPE FIRST**: The headline determines the narrative frame
2. **MIX BENEFIT ANGLES WITHIN THAT FRAME**:
   - CORRECT: First-person headline → personal experiences covering different angles
   - WRONG: First-person headline with "You feel tired" content`
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
${examples}

## Output format requirements

Generate clean, well-formatted Markdown with CLEAR SECTIONS using ## headings.

**Required structure:**

## Headline
[ONE headline using patterns from the examples. MUST include product name or specific category. The ENTIRE listicle must be congruent with this headline's voice.]

## Subheadline
[ONE subheadline that flows naturally from the headline. Match the voice/tone.]

## Introduction
[ONE introduction paragraph using the slippery slope technique]

## CTA
[ONE primary CTA that matches the listicle's tone - action-driven, never "Learn More" or "Buy Now"]

## Quick Proof
[Social proof elements - ONLY if real data was provided]

## List Item #1: [Specific Benefit Headline]
**Body copy:** [2-3 sentences]
**Visual suggestion:** [Describe what image would work here]

[Continue for all list items - each as separate ## section]

## Product Reveal
[After list items 3-5. Transition + product intro + bullet benefits + social proof]

## The Offer
[Offer headline + urgency + value stack + CTA + risk reversal]

## FAQ
[5-8 Q&A pairs addressing common objections]

## Final CTA
[Recap + social proof line + final CTA with urgency]

Generate now.`;
}


// Step 1: Generate headline options only
export async function generateHeadlines(
  brief: ProductBrief,
  request: GenerationRequest
): Promise<HeadlineOption[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const systemPrompt = `You are an expert e-commerce copywriter specializing in landing-page listicles.

Your task is to generate 5 different headline/angle options for a listicle. Each headline should use a DIFFERENT pattern and approach.

## THE 5 LISTICLE TYPES (choose from these)

### 1. FirstPersonReview
- "I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review"
- "I Finally Fixed My Afternoon Energy Crashes – Here's How"

### 2. ProblemAwareness
- "5 Signs You Need to Add Creatine to Your Daily Routine"
- "10 Reasons You're Not Lazy, You're Just Breathing Wrong"
- "5 Mistakes You're Making With Your Morning Coffee"

### 3. SocialProofAuthority
- "5 Reasons Why Movie Star Scott Eastwood IS OBSESSED WITH Laundry Sauce"
- "5 Reasons 1,000,000+ Home Chefs Are Making The Switch To HexClad"
- "5 Reasons Why Fitness Coach Kelsey Heenan Loves Create"
- "Why Everyone Is Obsessed with This Anti-Aging Treatment"
- "10 Reasons Harvard-Endorsed Barefoot Shoes Prevent Foot Surgery"

### 4. Comparison
- "10 Reasons to Ditch Drugstore Deodorant for Sweat Care"
- "8 Reasons Why Everyone Is Replacing Their Old Bedding with This"
- "6 Reasons To Toss The Floss & Start Flausing"

### 5. Hybrid (mix angles within one voice)

## HEADLINE QUALITY REQUIREMENTS

✅ EVERY headline MUST have:
- The actual PRODUCT NAME or BRAND (e.g., "Laundry Sauce", "HexClad", "Grüns")
  OR a SPECIFIC CATEGORY if brand unknown (e.g., "This High-Protein Iced Coffee", "These Barefoot Shoes")
- The EXACT number the user selected (see itemCount below)
- A clear ANGLE or PROMISE
- SPECIFICITY that tells you exactly what the listicle is about

❌ NEVER generate these BAD headlines:
- "I finally found something that helped" (no product, too vague)
- "This changed everything" (no specificity)  
- "The best product I've tried" (generic, no product name)
- "5 Reasons to Try This Amazing Product" (generic)
- "Why I Love This" (no context)
- Any headline without the product name or specific category

## OUTPUT FORMAT

Return ONLY valid JSON in this exact format:
{
  "headlines": [
    {
      "headline": "The actual headline text WITH product name",
      "angle": "Pattern name (FirstPersonReview, ProblemAwareness, SocialProofAuthority, Comparison, or Hybrid)",
      "description": "One sentence explaining what this approach emphasizes"
    }
  ]
}

Generate exactly 5 headlines using DIFFERENT patterns for variety. EVERY headline must include the product name or specific category.`;

  const userPrompt = `Generate 5 headline options for this product:

**Product**: ${brief.title}
**Brand**: ${brief.brand || 'Unknown'}
**Category**: ${brief.categoryHints?.join(', ') || 'General'}
**Key Benefits**: ${brief.benefits.slice(0, 5).join('; ') || 'Not specified'}
**Review Count**: ${brief.reviews?.count || 'Unknown'}
**Number of list items**: ${request.itemCount}
**Target Mode(s)**: ${request.modes.join(', ')}

⚠️ CRITICAL: 
1. Every headline MUST include "${brief.brand || brief.title}" or a specific category description
2. Headlines with numbers MUST use exactly ${request.itemCount} (e.g., "${request.itemCount} Reasons...", "${request.itemCount} Signs...")
Never use generic phrases like "this product" or "something that helped".

Return ONLY valid JSON with 5 different headline options.`;

  let response;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.7,
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

// Step 2: Generate full listicle with selected headline
export async function generateListicleWithHeadline(
  brief: ProductBrief,
  request: FullListicleRequest
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const blueprint = LISTICLE_BLUEPRINT;
  const examples = EXAMPLE_PATTERNS;
  const copyGuide = COPY_GUIDE;

  const systemPrompt = buildSystemPrompt(blueprint, copyGuide);
  
  const basePrompt = buildUserPrompt(brief, request, examples);
  
  const userPrompt = `# SELECTED HEADLINE (USE THIS EXACTLY)

**Headline**: ${request.selectedHeadline.headline}
**Angle**: ${request.selectedHeadline.angle}
**Approach**: ${request.selectedHeadline.description}

⚠️ CRITICAL: Generate the ENTIRE listicle using this EXACT headline. All content must be congruent with this headline's voice and frame.

---

${basePrompt}

## REMINDER: Use the selected headline above. Do NOT generate headline options - use the one provided.`;

  let response;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await anthropic.messages.create({
        model: 'claude-opus-4-5-20251101',
        max_tokens: 16000,
        temperature: 0.8,
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

  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return textContent.text;
}
