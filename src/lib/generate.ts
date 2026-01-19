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

## HOW TO WRITE: Subheadline & Introduction

### Subheadline Patterns (pick one that fits):
- **Problem + Promise + Incentive:** "Learn how to [identify problem/get result] and if [Product] is right for you - plus, save [X]% to try for yourself!"
- **Expert + Promise:** "[Expert name/title] recommends [Product] to everyone - learn why, plus save [X]%!"
- **Curiosity Hook:** "Read this BEFORE your [next coffee run/next purchase/etc]!"
- **Authority + Tease:** "As a [role], I [context]. Here's what I found..."

### Introduction Structure (The Slippery Slope):
1. **Open with pain, question, or relatable scenario** - "Tired, even after a full night's sleep?" or "Do you drag yourself through workouts?"
2. **Validate with empathy** - "You're not alone." or "We've all been there."
3. **Optional stat or proof** - Ground it in reality
4. **Tease the list** - "Here's what's really going on..." or "Here are [X] reasons why..."

**Example Introduction (First-Person/Review):**
"As a beauty writer, former dancer, and mom of two, I eat clean, whole foods and try to stay consistent with my wellness routine. But despite my nutrient-rich diet, I learned the hard way: modern diets actually aren't cutting it. That realization led me to [Product], which helps amplify my everyday nutrition in just a handful of gummy bears."

**Example Introduction (Symptom Awareness):**
"Do you drag yourself through workouts, no matter how much you sleep? You might be low on cellular energy. Here are 5 signs you need to add creatine to your daily routine."

---

## HOW TO WRITE: Each List Item

Each numbered item should:
1. **Clear headline** - Numbered, bolded, specific benefit or symptom
2. **"You" scenario OR personal experience** (depending on listicle type)
3. **Simple explanation** - Why it matters or what causes it
4. **Agitate the pain OR show the benefit** - Make them feel it
5. **Visual suggestion** - Product in use, before/after, or person experiencing the problem
6. **Transition** - Bridge to next item naturally

**Good List Item Example:**
"**1. You Feel Tired All the Time**
Tired, even after a full night's sleep? You might be low on cellular energy. Creatine helps replenish ATP, your body's main energy source, to keep you going strong. It's even been shown to boost performance under sleep deprivation—so you can fight fatigue and stay sharp, all day long."

---

## HOW TO WRITE: Product Reveal Section

**TIMING:** After 3-5 list items, introduce the product as the natural "answer" or "diagnosis."

**Structure:**
1. **Transition sentence** - "It's never been easier to see the difference for yourself." or "That's exactly why [Product] was created."
2. **Product introduction** - Position as the solution to everything discussed
3. **3-5 bullet benefits** - Key product differentiators
4. **Social proof moment** - Customer count, testimonial, or rating

**Example Product Reveal:**
"It's never been easier to see the difference for yourself. [Product] is the world's first [category] designed specifically for [audience]. With [key ingredient], you get:
- [Benefit 1 - specific and quantified]
- [Benefit 2 - addresses a pain point from the list]
- [Benefit 3 - social proof or credibility]

Join [X]+ customers who've already made the switch."

---

## HOW TO WRITE: The Offer/CTA Section

**Structure:**
1. **Offer headline** - "UP TO [X]% OFF FOR A LIMITED TIME ONLY!"
2. **Urgency element** - Timer, limited stock, or deadline
3. **Value stack** - List everything they get
4. **CTA button** - Action-driven, specific (never "Learn More")
5. **Risk reversal** - Money-back guarantee, free trial

**Example:**
"UP TO 58% OFF FOR A LIMITED TIME ONLY!
This limited-time deal is in high demand and stock keeps selling out.
✓ Free shipping ✓ 30-Day Money Back Guarantee ✓ Free gifts included
[GET 58% OFF →]
Try it today with a 30-Day Money Back Guarantee!"

---

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

const EXAMPLE_PATTERNS = `# Example Listicle Patterns (with REAL copy examples)

## Pattern 1: Problem/Symptom Awareness
Headline: "5 Signs You Need to Add Creatine to Your Daily Routine"
Subheadline: "Learn how to identify if you need to take creatine and if Create's gummies are the right choice for you - plus, save up to 50% to try for yourself!"

List items (second-person, symptom-focused):
1. "You feel tired all the time" → "Tired, even after a full night's sleep? You might be low on cellular energy. Creatine helps replenish ATP, your body's main energy source, to keep you going strong."
2. "Your muscles are sore and your recovery is slow" → "Sore muscles slowing you down? Creatine supports muscle hydration and repair, helping reduce soreness and inflammation."
3. "Your workouts feel flat and sluggish" → "Your muscles might be low on quick-access energy. Creatine boosts ATP production, giving you the power, strength, and endurance to push past limits."
4. "You have daily brain fog" → "Your brain runs on energy too—and creatine helps power it. By boosting brain energy metabolism, creatine supports focus, memory, and mental clarity."

Product Reveal: "It's never been easier to see the difference for yourself. Try now and save up to 50% today."

## Pattern 2: First-Person Review (Editorial Style)
Headline: "I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review"
Subheadline: "As a beauty writer, former dancer, and mom of two, I eat clean, whole foods and try to stay consistent with my wellness routine. But despite my nutrient-rich diet, I learned the hard way: modern diets actually aren't cutting it."

List items (first-person, experience-driven):
1. "It Helped Beat the Bloat" → "I eat clean, but bloat still creeps in sometimes. Since starting Grüns, I've noticed my digestion is way more regular and my stomach feels flatter throughout the day. Let's just say… things are moving smoothly."
2. "No More Mid-Day Crashes" → "I work from home, which means I'm extra vulnerable to the dreaded afternoon slump. Before Grüns, I'd crash after lunch. Now? No slump. No caffeine crash. Just steady, sustained energy."
3. "I'm Focused AF" → "Between laundry, dishes, ballet signups, and writing deadlines, mental clarity is everything and Grüns delivers. I'm sharper, faster, and not losing hours to distractions."
4. "It Replaces a Countertop Full of Supplements" → "I used to rotate between packets, pills, powders, and even pricey mushroom drinks. Grüns simplified all of it."

Voice: Personal, relatable, honest. "For me...", "I noticed...", "My experience was..."

## Pattern 3: Expert Endorsement
Headline: "5 Reasons Why Fitness Coach Kelsey Heenan Loves Create"
Subheadline: "Creatine isn't just for the guys - learn why certified trainer and nutrition coach Kelsey Heenan recommends Create gummies for all of her clients and takes them herself - plus, save up to 42% to try for yourself!"

List items (expert-quoted):
1. "They're made with Creapure®, the highest-quality creatine monohydrate in the world" → "As a fitness coach and nutrition expert, Kelsey Heenan only recommends what works—and that's Create. Every gummy is made with Creapure®, the most studied, safe, and effective form of creatine."
2. "They're delicious and travel-friendly" → "Traditional powders? Chalky, messy, and a pain to travel with. As a certified trainer and nutrition coach, Kelsey needed something better for her on-the-go lifestyle."
3. "Creatine can be even more beneficial for women than men" → "While often associated with bulking bros, creatine can be even more impactful for women—supporting strength, focus, and energy, especially during hormonal shifts."

## Pattern 4: Social Proof / Reasons to Buy
Headline: "5 Reasons 1,000,000+ Home Chefs Are Making The Switch To HexClad"

List items (benefit-driven with proof):
1. "Cook an entire meal with one pan" → "HexClad's hybrid design lets you effortlessly transition from stovetop to oven, simplifying meal prep and reducing the pile-up in your sink."
2. "Effortless cleanup" → "Say goodbye to scrubbing and soaking! HexClad's advanced nonstick surface allows for quick and easy cleanup."
3. "Perfect Heat Distribution" → "HexClad's patented hybrid technology prevents hot spots and ensures even cooking."
4. "Trusted and used by Michelin-star chefs worldwide" → "When culinary masters like Gordon Ramsay rely on HexClad for their high-stakes cooking, you know it's a game-changer."
5. "Backed by a Lifetime Warranty" → "Our confidence in our cookware is backed by our lifetime warranty."

## Pattern 5: Comparison/Category Switch
Headline: "10 Reasons to Ditch Drugstore Deodorant for Sweat Care"
Subheadline: "Learn about Superior Sweat Defense with Carpe"

List items:
1. "Drugstore deodorants still leave you sweaty and smelly" → "Here's a fun fact: Odor comes from sweat, yet most traditional deodorants don't actually target sweat. Carpe tackles sweat by using sweat-preventing and sweat-absorbing ingredients."
2. "Big deodorant brands don't understand your sweat struggle" → "Sometimes you want to sweat, and sometimes you don't. Carpe's co-Founders know exactly what it's like to sweat more than you want to."
3. "They only have products for the underarms" → "Carpe is leading the charge on innovating new sweat products."
4. "You want to rock any color in your closet" → "To all of those shirts shoved into the back of your closet for fear of sweat stains - it's your time to shine!"

## CRITICAL: Hybrid Listicle Rules
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

⚠️ **HEADLINE PATTERNS (from real high-converting listicles)**

**SOCIAL PROOF PATTERNS:**
- Celebrity/Expert Obsession: "5 Reasons Why Movie Star Scott Eastwood IS OBSESSED WITH Laundry Sauce"
- Mass Numbers: "5 Reasons 1,000,000+ Home Chefs Are Making The Switch To HexClad"
- Millions Switching: "6 Reasons WHY millions are switching to the ridge wallet"
- Audience-Specific: "5 REASONS WHY THOUSANDS OF WOMEN ARE SWITCHING TO GEL POLISH POPS"
- Everyone/FOMO: "5 Reasons Why Everyone is Obsessed with This Anti-Aging Treatment"

**EXPERT/AUTHORITY PATTERNS:**
- Expert Endorsement: "5 Reasons Why Fitness Coach Kelsey Heenan Loves Create"
- Authority Badge: "10 Reasons Harvard-Endorsed Barefoot Shoes Prevent Foot Surgery"
- Meet The + Authority: "Meet The Revolutionary Electric Flosser Praised by Shark Tank"

**PROBLEM/SYMPTOM PATTERNS:**
- Symptom Awareness: "5 Signs You Need to Add Creatine to Your Daily Routine"
- Reframe/Myth-Bust: "10 Reasons You're Not Lazy, You're Just Breathing Wrong"
- Pain Point Opener: "If you're always running late, this ONE TOOL will..."
- Problem Solved: "How People of All Ages Are Finding Relief from Insomnia & Anxiety"

**COMPARISON PATTERNS:**
- Category Switch: "10 Reasons to ditch drugstore deodorant for sweat care"
- Replacement: "8 Reasons Why Everyone Is Replacing Their Old Bedding with This..."
- Action Wordplay: "6 Reasons To Toss The Floss & Start Flausing"

**PROMISE/OUTCOME PATTERNS:**
- Bold Transformation: "YOUR LAUNDRY. REIMAGINED."
- Outcome + Simplicity: "The Ultimate Glow Is Easy As 1-2-3"
- Best/Upgrade: "12 Reasons Why Javvy Could be the Best Upgrade to Your Morning Routine"
- Paradigm Shift: "5 Ways WTF Will Change the Way You Think About Foundation"
- Stats Punch: "10 seconds. 20g protein. Zero BS."

**FIRST-PERSON/REVIEW PATTERNS:**
- First-Person + Buzz: "I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review"

**SCARCITY/TIMELINESS PATTERNS:**
- Exclusivity: "5 Reasons Why This Exclusive Jones Road Anniversary Kit Is a Must-Have"
- Trend: "10 Reasons Why This High-Protein Iced Coffee is the Coolest Beverage Trend of 2025"

NEVER use vague headlines like "I finally found something that helped" or "This changed everything"

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

1. **HEADLINES MUST BE SPECIFIC**: Use product name, category, OR problem-focus:
   - With product: "I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review"
   - With category: "I Tried This High-Protein Iced Coffee – Here's My Honest Review"
   - Problem-focus: "I Finally Fixed My Afternoon Energy Crashes – Here's How"
   - BAD: "I finally found something that helped" (too vague, no context)

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

## Headline
[ONE headline using a pattern from the system prompt. Choose the best pattern for this product/audience. The ENTIRE listicle must be congruent with this headline's voice and frame.]

## Subheadline
[ONE subheadline that flows naturally from the headline. Match the voice/tone.]

## Introduction
[ONE introduction paragraph using the slippery slope technique:
1. Open with pain, question, or relatable scenario
2. Validate with empathy
3. Optional grounding stat or proof
4. Tease the list]

## CTA
[ONE primary CTA that matches the listicle's tone - action-driven, never "Learn More" or "Buy Now"]

## Quick Proof
[Social proof elements - ONLY if real data was provided: review count, star rating, customer count, trust badges]

## List Item #1: [Specific Benefit Headline]
**Body copy:** [2-3 sentences following the structure:
- Open with scenario or experience
- Simple explanation of why it matters
- Agitate the pain OR amplify the benefit]
**Visual suggestion:** [Describe what image would work here]

## List Item #2: [Specific Benefit Headline]
[Continue same structure...]

[Continue for all list items - each as separate ## section. REMEMBER: Each item must cover a DIFFERENT angle. No repetition.]

## Product Reveal
[This section comes AFTER list items 3-5. Structure:
1. **Transition sentence:** "It's never been easier to see the difference for yourself." or "That's exactly why [Product] was created."
2. **Product introduction:** Position as the natural answer to everything discussed
3. **3-5 bullet benefits:** Key differentiators
4. **Social proof moment:** Customer count, testimonial, or rating if available]

## The Offer
[Structure:
1. Offer headline with discount/value
2. Urgency element (timer, limited stock, deadline)
3. Value stack (list everything they get)
4. ONE CTA button (action-driven, specific, matches the listicle tone)
5. Risk reversal (money-back guarantee, free trial)]

## FAQ
[5-8 Q&A pairs addressing common objections. Format:
**Q: [Question]**
A: [Answer - concise, benefit-focused, objection-handling]]

## Final CTA
[Structure:
1. Recap main benefit in one powerful sentence
2. Social proof line (testimonial quote, customer count, or star rating if available)
3. ONE final CTA with urgency - consistent with the rest of the listicle]

**Critical formatting rules:**
- Use ## for main section headings (makes them individually copyable)
- Use ### for sub-sections within a section
- Use **bold** for emphasis
- Use - or * for bullet lists
- Use emojis strategically for visual breaks
- Keep it scannable and benefit-driven
- Write at a 6th grade reading level - short sentences, simple words
- Every sentence should pull the reader to the next (slippery slope)

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

## HEADLINE PATTERNS (use variety from these):

**SOCIAL PROOF PATTERNS:**
- Celebrity/Expert Obsession: "5 Reasons Why Movie Star Scott Eastwood IS OBSESSED WITH Laundry Sauce"
- Mass Numbers: "5 Reasons 1,000,000+ Home Chefs Are Making The Switch To HexClad"
- Everyone/FOMO: "5 Reasons Why Everyone is Obsessed with This Anti-Aging Treatment"

**EXPERT/AUTHORITY PATTERNS:**
- Expert Endorsement: "5 Reasons Why Fitness Coach Kelsey Heenan Loves Create"
- Authority Badge: "10 Reasons Harvard-Endorsed Barefoot Shoes Prevent Foot Surgery"

**PROBLEM/SYMPTOM PATTERNS:**
- Symptom Awareness: "5 Signs You Need to Add Creatine to Your Daily Routine"
- Reframe/Myth-Bust: "10 Reasons You're Not Lazy, You're Just Breathing Wrong"
- Problem Solved: "How People of All Ages Are Finding Relief from Insomnia & Anxiety"

**COMPARISON PATTERNS:**
- Category Switch: "10 Reasons to ditch drugstore deodorant for sweat care"
- Replacement: "8 Reasons Why Everyone Is Replacing Their Old Bedding with This..."

**PROMISE/OUTCOME PATTERNS:**
- Bold Transformation: "YOUR LAUNDRY. REIMAGINED."
- Outcome + Simplicity: "The Ultimate Glow Is Easy As 1-2-3"
- Stats Punch: "10 seconds. 20g protein. Zero BS."

**FIRST-PERSON/REVIEW PATTERNS:**
- First-Person + Buzz: "I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review"

**SCARCITY/TIMELINESS PATTERNS:**
- Exclusivity: "5 Reasons Why This Exclusive Jones Road Anniversary Kit Is a Must-Have"
- Trend: "10 Reasons Why This High-Protein Iced Coffee is the Coolest Beverage Trend of 2025"

## OUTPUT FORMAT

Return ONLY valid JSON in this exact format:
{
  "headlines": [
    {
      "headline": "The actual headline text",
      "angle": "Pattern name (e.g., 'Social Proof', 'First-Person Review')",
      "description": "One sentence explaining what this approach emphasizes"
    }
  ]
}

Generate exactly 5 headlines using DIFFERENT patterns for variety.`;

  const userPrompt = `Generate 5 headline options for this product:

**Product**: ${brief.title}
**Brand**: ${brief.brand || 'Unknown'}
**Category**: ${brief.categoryHints?.join(', ') || 'General'}
**Key Benefits**: ${brief.benefits.slice(0, 5).join('; ') || 'Not specified'}
**Review Count**: ${brief.reviews?.count || 'Unknown'}
**Target Mode(s)**: ${request.modes.join(', ')}

Return ONLY valid JSON with 5 different headline options.`;

  let response;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514', // Faster model for headlines
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
  
  // Build user prompt with the selected headline
  const basePrompt = buildUserPrompt(brief, request, examples);
  
  // Inject the selected headline at the start
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
