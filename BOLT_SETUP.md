# Bolt.new Setup Instructions

This document provides step-by-step instructions for deploying this Next.js project on Bolt.new.

## Prerequisites

You'll need an Anthropic API key from: https://console.anthropic.com/

## Setup Steps for Bolt.new

### 1. Environment Variables

In Bolt.new, make sure to set the following environment variable:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

**How to set environment variables in Bolt.new:**
1. Click on the Settings/Configuration icon
2. Navigate to Environment Variables
3. Add `ANTHROPIC_API_KEY` with your actual API key

### 2. Force Clean Install

If you're still seeing the `workUnitAsyncStorage` error after the fixes, try these steps in Bolt.new:

1. Delete the `.next` folder (if visible)
2. Delete `node_modules` folder
3. Run: `npm install`
4. Run: `npm run dev`

### 3. Common Issues and Solutions

#### Issue: "Invariant: Expected workUnitAsyncStorage to have a store"

**Solution:**
- This has been fixed by pinning Next.js to version `15.1.3` (no caret)
- Added `dynamic = 'force-dynamic'` to all API routes
- Moved runtime exports to the top of API route files
- Added experimental server actions config

If the error persists:
1. Clear Bolt.new cache (if available)
2. Try restarting the dev server
3. Make sure you're using Node.js 18+ or 20+

#### Issue: Missing API Key Error

**Solution:**
- Make sure `ANTHROPIC_API_KEY` is set in environment variables
- Restart the dev server after adding environment variables

#### Issue: Build Failures

**Solution:**
- Ensure all dependencies are installed: `npm install`
- Check that TypeScript compilation succeeds: `npm run build`
- Review the build logs for specific errors

## Project Structure

```
web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   │   ├── generate/ # Main listicle generation
│   │   │   └── revise/   # Revision endpoint
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   └── lib/             # Utility functions
├── public/              # Static assets
├── next.config.ts       # Next.js configuration
└── package.json         # Dependencies

```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Vercel Deployment (Alternative to Bolt.new)

If Bolt.new continues to have issues, you can deploy directly to Vercel:

1. Push this code to GitHub
2. Import the repository in Vercel
3. Set the `ANTHROPIC_API_KEY` environment variable
4. Deploy!

## Troubleshooting Checklist

- [ ] Environment variable `ANTHROPIC_API_KEY` is set
- [ ] Using Node.js 18+ or 20+
- [ ] All dependencies installed (`node_modules` exists)
- [ ] No `.next` cache from previous failed builds
- [ ] Using the exact Next.js version `15.1.3` (check `package-lock.json`)

## Support

If issues persist after following these steps, check:
1. Bolt.new's platform logs for specific error messages
2. Browser console for client-side errors
3. Server logs for API route errors
