import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { ProductBrief } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ReviseRequest = z.object({
  markdown: z.string().min(1),
  instruction: z.string().min(1),
  brief: ProductBrief.optional(),
});

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validatedRequest = ReviseRequest.parse(body);

    // Check if API key is set
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    // Build the revision prompt
    const systemPrompt = buildRevisionSystemPrompt();
    const userPrompt = buildRevisionUserPrompt(
      validatedRequest.markdown,
      validatedRequest.instruction,
      validatedRequest.brief
    );

    console.log(`Revising listicle with instruction: "${validatedRequest.instruction}"`);

    // Call Claude with retry logic
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
        console.error(`Revision attempt ${attempt} failed:`, error.status, error.message);

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

    const revisedMarkdown = textContent.text;
    console.log('Revision complete');

    return NextResponse.json({ markdown: revisedMarkdown });
  } catch (error: any) {
    console.error('Revision error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Revision failed' },
      { status: 500 }
    );
  }
}

function buildRevisionSystemPrompt(): string {
  return `You are an expert e-commerce copywriter helping revise landing-page listicle copy. Your job is to take existing listicle markdown and revise it according to the user's instructions.

# CRITICAL RULES

⚠️ **STAY TRUE TO THE ACTUAL PRODUCT**
- You will receive the original product context (brief) if available
- ONLY use facts explicitly stated in that product brief
- NEVER invent new features, benefits, or claims that aren't in the source material
- If the user asks you to add information that isn't in the brief, politely note what you cannot verify

⚠️ **PRESERVE STRUCTURE AND FORMATTING**
- Maintain the same markdown structure (## sections, lists, bold text, etc.)
- Keep the same section headings unless explicitly asked to change them
- Preserve visual suggestions and formatting

⚠️ **ONLY USE REAL SOCIAL PROOF**
- Keep ONLY the testimonials, review snippets, and stats from the original
- NEVER add fake customer quotes or invented proof
- If asked to add social proof that doesn't exist, skip it

⚠️ **OUTPUT CLEAN MARKDOWN**
- Return ONLY the revised markdown content
- No preamble, no explanations, no meta-commentary
- Just the clean, revised listicle copy

# Common revision requests and how to handle them

**"Make it shorter"** → Remove less impactful sentences, tighten language, but keep all key benefits
**"Make it more concise"** → Same as shorter - eliminate fluff while preserving substance
**"Add information about X"** → Only add X if it's in the product brief; otherwise note the limitation
**"More/less formal"** → Adjust tone while keeping the same content
**"Emphasize Y"** → Highlight Y more prominently in relevant sections
**"Remove Z"** → Remove mentions of Z throughout`;
}

function buildRevisionUserPrompt(
  currentMarkdown: string,
  instruction: string,
  brief?: z.infer<typeof ProductBrief>
): string {
  const briefSection = brief
    ? `
# Product context (for grounding your revision)

**URL**: ${brief.url}
**Title**: ${brief.title}
**Brand**: ${brief.brand || 'Unknown'}
**Price**: ${brief.price || 'Not specified'}
**Description**: ${brief.description || 'None'}

**Benefits** (${brief.benefits.length}):
${brief.benefits.map((b, i) => `${i + 1}. ${b}`).join('\n') || 'None'}

**Claims** (${brief.claims.length}):
${brief.claims.map((c, i) => `${i + 1}. ${c}`).join('\n') || 'None'}

${brief.reviews ? `**Reviews**: ${brief.reviews.count || '?'} reviews, ${brief.reviews.rating || '?'} stars` : ''}

⚠️ IMPORTANT: Only use facts from this context. Do not invent new features or benefits.
`
    : `
⚠️ WARNING: No product context provided. Revise the copy as requested but do NOT add new product claims or features that aren't already in the markdown below.
`;

  return `${briefSection}

# Current listicle markdown

\`\`\`markdown
${currentMarkdown}
\`\`\`

# User's revision instruction

${instruction}

# Your task

Revise the listicle markdown above according to the user's instruction. Remember:
- Stay true to the product facts
- Preserve markdown structure and formatting
- Only use real social proof
- Output ONLY the revised markdown (no explanations)

Generate the revised markdown now:`;
}
