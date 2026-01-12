# Template Images Setup

## Required Images

Place the listicle screenshot images in this `/public/templates/` directory with the following filenames:

### Required Files:

1. `calm-email.jpg` - Calm Magnesium Email Newsletter
2. `down-to-ground.jpg` - Down to Ground 8 Reasons Grounding Mattress
3. `quality-edit-gruns.jpg` - The Quality Edit Grüns Gummies Review
4. `polish-pops.jpg` - Polish Pops 5 Reasons Gel Polish
5. `cocunat.jpg` - Cocunat 5 Reasons Anti-Aging Treatment
6. `javvy-protein.jpg` - Javvy Protein-Packed Coffee Upgrade
7. `jones-road-foundation.jpg` - Jones Road 5 Ways WTF Foundation
8. `foot-secrets.jpg` - Foot-Secrets 10 Reasons Barefoot Shoes
9. `ogle-foundation-1.jpg` - Ogle Skincare-Infused Liquid Foundation
10. `ogle-foundation-2.jpg` - Ogle Liquid Foundation (Alt Layout)
11. `ogle-foundation-3.jpg` - Ogle Foundation Benefits Layout
12. `ridge-wallet.jpg` - Ridge 6 Reasons Black Friday Wallet
13. `olipop.jpg` - Olipop Customer Testimonials
14. `javvy-iced-coffee.jpg` - Javvy 11 Reasons High-Protein Iced Coffee
15. `javvy-concentrate.jpg` - Javvy 12 Reasons Coffee Concentrate
16. `nood.jpg` - Nood Hair Removal Device Benefits
17. `ogle-glow.jpg` - Ogle Ultimate Glow Trio
18. `muora.jpg` - Muora 5 Reasons Probiotic Gummies
19. `jones-road-sunscreen.jpg` - Jones Road Mineral Sunscreen
20. `jones-road-balm.jpg` - Jones Road 8 Reasons Miracle Balm
21. `create-creatine.jpg` - Create 5 Signs Creatine Daily Routine
22. `create-gym.jpg` - Create 6 Reasons Gym Pre-Workout
23. `create-safety.jpg` - Create 5 Reasons Fitness Coach Safety
24. `laundry-sauce-eastwood.jpg` - Laundry Sauce Scott Eastwood 5 Reasons
25. `laundry-sauce.jpg` - Laundry Sauce Your Laundry Reimagined
26. `hexclad.jpg` - HexClad 5 Reasons 1M Home Chefs
27. `hostage-tape.jpg` - Hostage Tape 10 Reasons 150K Guys Love
28. `jones-road-kit.jpg` - Jones Road Anniversary Kit 5 Exclusives
29. `ogle-trio.jpg` - Ogle Everyday Makeup Trio 1-2-3

## Image Specifications

- **Format**: JPG or PNG
- **Aspect Ratio**: 9:16 (portrait/mobile optimized)
- **Recommended Size**: 800px width × 1422px height
- **Max File Size**: < 500KB for fast loading
- **Quality**: 75-85% for optimal balance

## How to Add Images

1. Export/screenshot each listicle template from the provided images
2. Crop to 9:16 aspect ratio (portrait)
3. Save with the exact filename from the list above
4. Place in `/public/templates/` directory
5. The app will automatically display them

## Fallback Behavior

If an image is missing, the app will display:
- A gradient placeholder background
- A file icon
- The template title

This ensures the gallery still works even if some images aren't uploaded yet.

## Need to Update?

To change template names or add new templates, edit:
`/web/src/components/TemplatesGrid.tsx`

See the main documentation file for more details.


