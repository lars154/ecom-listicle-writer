# Netlify Deployment Guide

## Quick Deploy Steps

### 1. Push your code to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"

# Add your GitHub repo and push
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### 2. Deploy to Netlify

#### Option A: Via Netlify UI (Recommended)
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account and select your repository
4. Netlify will auto-detect Next.js settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Framework**: Next.js

5. **Set Environment Variables** (IMPORTANT!):
   - Go to Site settings → Environment variables
   - Add: `ANTHROPIC_API_KEY` = `your-api-key-here`

6. Click "Deploy site"

#### Option B: Via Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy from the web directory
cd /Users/larspasslick/Desktop/Cursor\ AI/copywriter/web
netlify init

# Set environment variable
netlify env:set ANTHROPIC_API_KEY your-api-key-here

# Deploy
netlify deploy --prod
```

### 3. Verify Deployment
- Your site will be live at: `https://your-site-name.netlify.app`
- Test the listicle generator functionality
- Check the browser console for any errors

## Important Notes

- ✅ Netlify automatically supports Next.js 15 with the `@netlify/plugin-nextjs` plugin
- ✅ Your API routes will become serverless functions
- ✅ The `.next` folder is automatically generated during build
- ⚠️ Make sure to set your `ANTHROPIC_API_KEY` environment variable in Netlify settings
- ⚠️ The build will fail if environment variables are missing

## Environment Variables Required

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic/Claude API key for AI generation |

## Troubleshooting

**Build fails**: Check build logs in Netlify dashboard
**API not working**: Verify environment variables are set
**404 errors**: Make sure `netlify.toml` is in the root of your `web` directory

