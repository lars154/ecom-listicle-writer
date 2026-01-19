import { NextRequest, NextResponse } from 'next/server';
import { FullListicleRequest, ProductBrief } from '@/lib/types';
import { extractFromUrl } from '@/lib/extract';
import { generateListicleWithHeadline } from '@/lib/generate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the full listicle request
    const validatedRequest = FullListicleRequest.parse(body.request);
    
    // Get the brief - either from cache or re-extract
    let brief: ProductBrief;
    if (body.brief) {
      brief = ProductBrief.parse(body.brief);
    } else {
      console.log(`Re-extracting from URL: ${validatedRequest.url}`);
      brief = await extractFromUrl(validatedRequest.url);
    }

    console.log(`Generating listicle with headline: ${validatedRequest.selectedHeadline.headline}`);

    // Generate the full listicle using the selected headline
    const markdown = await generateListicleWithHeadline(brief, validatedRequest);
    console.log(`Generated listicle markdown`);

    return NextResponse.json({ markdown, brief });
  } catch (error: any) {
    console.error('Listicle generation error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Listicle generation failed' },
      { status: 500 }
    );
  }
}
