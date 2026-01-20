# Listicle Writer MVP

An AI-powered e-commerce listicle generator for landing pages, powered by Claude Opus 4.5.

## Features

- 🔗 **URL-first**: Paste a Shopify product or landing page URL
- 📝 **5 listicle types**: 5 distinct narrative voices covering all high-converting patterns
- 🎨 **Copy/paste blocks**: Pre-formatted sections ready for Replo or Shopify
- 🤖 **Grounded AI**: Uses your 3 markdown guides as knowledge base
- ⚡ **Fast**: Generates in 30–60 seconds

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   ```
   
   Add your Anthropic API key to `.env`:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

3. **Run dev server**:
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## How it works

1. **Extract**: Fetches and parses the URL to extract product info (title, benefits, claims, reviews, FAQs)
2. **Generate**: Sends extracted data + your 3 markdown guides to Claude Opus 4.5
3. **Output**: Returns structured JSON blocks (Hero, Items, Proof, Offer, FAQ, Final CTA)
4. **Copy/paste**: Each block has a copy button for easy Replo/Shopify integration

## Listicle types supported (5 narrative voices)

- ✍️ **FirstPersonReview** - "I Tried [Product] – Here's My Honest Review"
- ❗ **ProblemAwareness** - "5 Signs You Need...", "X Mistakes You're Making..."
- ⭐ **SocialProofAuthority** - "5 Reasons 1M+ People...", "Why [Expert] Loves..."
- ⚖️ **Comparison** - "10 Reasons to Ditch [Old] for [New]"
- 🔀 **Hybrid** - Mix angles within one consistent voice

## Project structure

```
web/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main UI
│   │   ├── layout.tsx
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts   # Generation endpoint
│   ├── components/
│   │   ├── ListicleForm.tsx   # Input form
│   │   └── OutputViewer.tsx   # Output blocks
│   └── lib/
│       ├── types.ts           # Zod schemas
│       ├── extract.ts         # URL extraction
│       └── generate.ts        # Claude generation
├── package.json
└── .env
```

## Knowledge base

The AI uses these files as grounded context (place them in the parent directory):

- `The Ultimate Listicle Blueprint.md`
- `Example Listicles Copy List.md`
- `How To Write Good Copy For E-Commerce.md`

## Tech stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Claude Opus 4.5** (via Anthropic SDK)
- **Cheerio** (HTML parsing)
- **Zod** (schema validation)

## License

Private / Internal Use


