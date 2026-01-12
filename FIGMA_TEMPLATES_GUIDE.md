# Figma Templates Guide

## Overview
The Figma Templates tab displays a grid of listicle design templates from 8-9 figure brands. Users can hover over templates to see a "Download" button that opens the Figma file in a new tab.

## How to Update Templates

All template data is stored in `/src/components/TemplatesGrid.tsx`.

### Template Data Structure

Each template has the following properties:

```typescript
{
  id: number,           // Unique identifier
  title: string,        // Display name (e.g., "Jones Road - Foundation")
  imageUrl: string,     // Path to preview image
  figmaUrl: string,     // Figma file URL
}
```

### Adding/Updating Templates

1. Open `/src/components/TemplatesGrid.tsx`
2. Locate the `templates` array (around line 7)
3. Update the template data:

```typescript
const templates = [
  {
    id: 1,
    title: 'Your Brand - Product Name',
    imageUrl: '/templates/your-image.jpg',
    figmaUrl: 'https://www.figma.com/design/your-actual-figma-url',
  },
  // ... more templates
];
```

### Adding Preview Images

1. Place your template preview images in `/public/templates/`
2. Update the `imageUrl` property to match: `/templates/your-image.jpg`
3. Recommended image specs:
   - Aspect ratio: 9:16 (portrait)
   - Format: JPG or PNG
   - Size: < 500KB for fast loading

**Note:** The app has a fallback for missing images, so templates will still display even if images aren't uploaded yet.

## Current Templates

The app currently includes 29 templates from brands including:
- **Calm** - Magnesium email newsletter
- **Down to Ground** - Grounding mattress cover
- **The Quality Edit** - Grüns Gummies review
- **Polish Pops** - Gel polish reasons
- **Cocunat** - Anti-aging treatment
- **Javvy** - Protein coffee (3 variants)
- **Jones Road** - Foundation, sunscreen, balm, anniversary kit (5 variants)
- **Foot-Secrets** - Barefoot shoes
- **Ogle** - Liquid foundation and makeup (5 variants)
- **Ridge** - Black Friday wallet
- **Olipop** - Customer testimonials
- **Nood** - Hair removal device
- **HexClad** - Cookware
- **Muora** - Probiotic gummies
- **Create** - Creatine and gym supplements (3 variants)
- **Laundry Sauce** - Laundry detergent (2 variants)
- **Hostage Tape** - Mouth tape for sleep

## Features

- **Hover Effect**: Download button appears on hover
- **Dark Mode Support**: Templates adapt to dark/light theme
- **Responsive Grid**: Automatically adjusts columns based on screen size
- **Image Fallback**: Gracefully handles missing images with placeholder icon
- **New Tab Opening**: Figma links open in new tab for better UX

