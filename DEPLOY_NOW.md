# 🚀 Deploy Your Listicle Writer to Netlify

## Click This Link to Deploy:

👉 **[Deploy to Netlify](https://app.netlify.com/start)**

---

## Follow These Simple Steps:

### Step 1: Connect GitHub (One-Time Setup)
1. Click "Import from GitHub"
2. Click "Authorize Netlify" (if asked)
3. You might need to create a GitHub account first at [github.com](https://github.com) - it's free!

---

## OR Use This Command (Copy & Paste):

Open **Terminal.app** on your Mac:
- Press `Cmd + Space` (⌘ + Space)
- Type: `Terminal`
- Press Enter

Then **copy and paste** this entire command:

```bash
cd /Users/larspasslick/Desktop/Cursor\ AI/copywriter/web && netlify sites:create --name listicle-writer-app --manual && netlify deploy --prod --dir=. --site listicle-writer-app
```

---

## After Deployment:

Add your Anthropic API key (copy and paste):

```bash
netlify env:set ANTHROPIC_API_KEY YOUR_KEY_HERE
```

Then redeploy:
```bash
netlify deploy --prod
```

---

Your site will be live at: **https://listicle-writer-app.netlify.app**

