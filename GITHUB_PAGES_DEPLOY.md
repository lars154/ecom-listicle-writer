# Deploy to GitHub Pages - Quick Guide

## ✅ Already Done
- [x] Images optimized: **317MB → 4.1MB** (98.7% smaller!)
- [x] Next.js configured for static export
- [x] GitHub Actions workflow created

## Deploy in 3 Steps

### Step 1: Clean Up (Optional but Recommended)

Delete the old unoptimized images and rename the optimized folder:

```bash
cd web

# Remove old 317MB folder
rm -rf public/templates

# Rename optimized folder
mv public/templates-optimized public/templates
```

Then update `TemplatesGrid.tsx` to use `/templates/` instead of `/templates-optimized/`:

```bash
# Quick find/replace
sed -i '' 's/templates-optimized/templates/g' src/components/TemplatesGrid.tsx
```

### Step 2: Push to GitHub

```bash
# From the web folder
git init
git add .
git commit -m "Initial commit - optimized for fast loading"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment", set **Source** to **GitHub Actions**
4. Wait for the workflow to complete (~2 minutes)
5. Your site is live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## ⚠️ Important: If Your Repo Name Is NOT `username.github.io`

If you're deploying to `https://username.github.io/my-repo-name/`, you need to set the base path.

Edit `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/my-repo-name',  // ← Uncomment and set your repo name
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

---

## ⚠️ API Routes Won't Work

GitHub Pages is **static only**. Your AI generation features (`/api/generate`, `/api/revise`) require a server.

**Options:**
1. **Netlify** (recommended) - Free, supports API routes
2. **Vercel** - Native Next.js hosting
3. **Keep templates-only on GitHub Pages** - Just show the templates gallery

### To Deploy on Netlify Instead:

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set ANTHROPIC_API_KEY your-key-here
netlify deploy --prod
```

---

## Performance Results

| Metric | Before | After |
|--------|--------|-------|
| Total images | 317 MB | 4.1 MB |
| Largest image | 24 MB | ~150 KB |
| Format | PNG | WebP |
| Expected load time | 10+ seconds | < 1 second |
