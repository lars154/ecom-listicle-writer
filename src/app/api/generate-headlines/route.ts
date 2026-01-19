import { NextRequest, NextResponse } from 'next/server';
import { GenerationRequest } from '@/lib/types';
import { extractFromUrl } from '@/lib/extract';
import { generateHeadlines } from '@/lib/generateHeadlines';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validatedRequest = GenerationRequest.parse(body);

    // Step 1: Extract product/page info from URL
    console.log(`Extracting from URL: ${validatedRequest.url}`);
    const brief = await extractFromUrl(validatedRequest.url);
    console.log(`Extracted brief:`, {
      title: brief.title,
      pageType: brief.pageType,
      categoryHints: brief.categoryHints,
      benefits: brief.benefits.length,
    });

    // Step 2: Generate headline options
    console.log(`Generating headline options...`);
    const headlines = await generateHeadlines(brief, validatedRequest);
    console.log(`Generated ${headlines.length} headline options`);

    return NextResponse.json({ headlines, brief });
  } catch (error: any) {
    console.error('Headline generation error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Headline generation failed' },
      { status: 500 }
    );
  }
}
