import { NextRequest, NextResponse } from 'next/server';
import { GenerationRequest } from '@/lib/types';
import { extractFromUrl } from '@/lib/extract';
import { generateListicle } from '@/lib/generate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

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
      descriptionLength: brief.description?.length || 0,
      benefits: brief.benefits.length,
      claims: brief.claims.length,
      reviews: brief.reviews?.count || 0,
      faqs: brief.faqs?.length || 0,
    });
    
    // Log first few benefits/claims for debugging
    if (brief.benefits.length > 0) {
      console.log('Sample benefits:', brief.benefits.slice(0, 3));
    }
    if (brief.claims.length > 0) {
      console.log('Sample claims:', brief.claims.slice(0, 3));
    }

    // Step 2: Generate listicle using Claude
    console.log(`Generating listicle with modes:`, validatedRequest.modes);
    const markdown = await generateListicle(brief, validatedRequest);
    console.log(`Generated listicle markdown`);

    return NextResponse.json({ markdown, brief });
  } catch (error: any) {
    console.error('Generation error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
} // Vercel supports 60s on free tier

