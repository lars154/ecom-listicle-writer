'use client';

import TemplateCard from './TemplateCard';

const templates = [
  {
    id: 1,
    title: 'Laundry Sauce - 5 Reasons Why Movie Star Scott Eastwood IS OBSESSED WITH Laundry sauce',
    imageUrl: '/templates/Laundry Sauce Listicle 1.webp',
    figmaUrl: 'https://www.figma.com/design/MbcBrD8MCH4kQDxT553OeO/Laundry-Sauce-Listicles?node-id=0-1&t=oIUzCIACs5h0GpXc-1',
  },
  {
    id: 2,
    title: 'Laundry Sauce - YOUR LAUNDRY. REIMAGINED.',
    imageUrl: '/templates/Laundry Sauce Listicle 2.webp',
    figmaUrl: 'https://www.figma.com/design/MbcBrD8MCH4kQDxT553OeO/Laundry-Sauce-Listicles?node-id=0-1&t=oIUzCIACs5h0GpXc-1',
  },
  {
    id: 3,
    title: 'Javvy Coffee - 11 Reasons Why This High-Protein Iced Coffee is the #1 Trending Drink for 2026',
    imageUrl: '/templates/Javvy Listicle 3.webp',
    figmaUrl: 'https://www.figma.com/design/xEysE5b5XAiEdvbZ3Yp2ND/Javvy-Coffee-Listicles?node-id=0-1&t=xRookP6XHpxN8qjl-1',
  },
  {
    id: 4,
    title: 'Javvy Coffee - 12 Reasons Why Javvy Could be the Best Upgrade to Your Morning Routine',
    imageUrl: '/templates/Javvy Coffee Listicle 4.webp',
    figmaUrl: 'https://www.figma.com/design/xEysE5b5XAiEdvbZ3Yp2ND/Javvy-Coffee-Listicles?node-id=0-1&t=xRookP6XHpxN8qjl-1',
  },
  {
    id: 5,
    title: 'Javvy Coffee - Your Protein-Packed Coffee Upgrade ✨',
    imageUrl: '/templates/Javvy Coffee Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/xEysE5b5XAiEdvbZ3Yp2ND/Javvy-Coffee-Listicles?node-id=0-1&t=xRookP6XHpxN8qjl-1',
  },
  {
    id: 6,
    title: 'Create - 5 Reasons Why Fitness Coach Kelsey Heenan Loves Create',
    imageUrl: '/templates/Trycreate Listicle 1.webp',
    figmaUrl: 'https://www.figma.com/design/vBLrCI1uPwmbm7K4j9FowE/Create-Listicles?node-id=1-3453&t=eNGQSr1YD2p4xz1X-1',
  },
  {
    id: 7,
    title: 'Create - 5 Signs You Need to Add Creatine to Your Daily Routine',
    imageUrl: '/templates/Trycreate Listicle 2.webp',
    figmaUrl: 'https://www.figma.com/design/vBLrCI1uPwmbm7K4j9FowE/Create-Listicles?node-id=1-3453&t=eNGQSr1YD2p4xz1X-1',
  },
  {
    id: 8,
    title: 'Create - 6 Reasons Why Gym Pros are Swapping to Create Creatine',
    imageUrl: '/templates/Trycreate Listicle 3.webp',
    figmaUrl: 'https://www.figma.com/design/vBLrCI1uPwmbm7K4j9FowE/Create-Listicles?node-id=1-3453&t=eNGQSr1YD2p4xz1X-1',
  },
  {
    id: 9,
    title: 'Flaus - Meet The Revolutionary Electric Flosser Praised by Shark Tank 🦈',
    imageUrl: '/templates/Flaus Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/zLkgRRd4nzvFqFSQVkimDE/Flaus-Listicles?node-id=0-1&t=K9l6Kb52Sjp968um-1',
  },
  {
    id: 10,
    title: 'Hike Footwear - 10 Reasons Harvard-Endorsed Barefoot Shoes Prevent Foot Surgery & Restore Mobility',
    imageUrl: '/templates/HIKE Footwear Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/TUnjpKDuF6mXgXl161IUsL/HIKE-Footwear-Listicles?node-id=0-1&t=aYYCAPPy6YqzciU4-1',
  },
  {
    id: 11,
    title: 'Cocunat Beauty - 5 Reasons Why Everyone is Obsessed with This',
    imageUrl: '/templates/Cocunat Beauty Listicle 1.webp',
    figmaUrl: 'https://www.figma.com/design/g0n1DAiuOY4p74vpN4Y7Bp/Cocunat-Listicles?node-id=0-1&t=Ng78dYb7Ufs9b10t-1',
  },
  {
    id: 12,
    title: 'Nuora - 12 Reasons Why Javvy Could be the Best Upgrade to Your Morning Routine',
    imageUrl: '/templates/Nuora Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/Cwa1w1lIKetuGhR3lwfubA/Nuora-Listicles?node-id=4001-162&t=QYAUc03LiUGXaIQd-1',
  },
  {
    id: 13,
    title: "Hexclad - HexClad does what your other pans can't.",
    imageUrl: '/templates/Hexclad Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/ak3diV3XfV0OCW5aAFEvmB/Hexclad-Listicles?node-id=0-1&t=esv0BqOXqry1BuOY-1',
  },
  {
    id: 14,
    title: 'The Ridge - 6 Reasons WHY millions are switching to the ridge wallet',
    imageUrl: '/templates/The Ridge Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/H2MvUbi298rxCDXvLwoFkq/The-Ridge-Listicles?node-id=0-1&t=7IwROFEH3RdPUWut-1',
  },
  {
    id: 15,
    title: 'Jones Road Beauty - 5 Ways WTF Will Change the Way You Think About Foundation',
    imageUrl: '/templates/Jones Road Beauty Listicle 1.webp',
    figmaUrl: 'https://www.figma.com/design/2U1YYG3JCuaOLEUir9iC6x/Jones-Road-Beauty-Listicles?node-id=0-1&t=TgPXCAkJ2Wcn9men-1',
  },
  {
    id: 16,
    title: 'Jones Road Beauty - 5 Reasons Why This Exclusive Jones Road Anniversary Kit Is a Must-Have',
    imageUrl: '/templates/Jones Road Beauty Listicle 2.webp',
    figmaUrl: 'https://www.figma.com/design/2U1YYG3JCuaOLEUir9iC6x/Jones-Road-Beauty-Listicles?node-id=0-1&t=TgPXCAkJ2Wcn9men-1',
  },
  {
    id: 17,
    title: "Nood - If you're always running late, this ONE TOOL will not only replace your razor, waxing kit and shaving cream but also save you tons of shaving time!",
    imageUrl: '/templates/Nood Listicle 2.webp',
    figmaUrl: 'https://www.figma.com/design/zsKezv0F7dYYUvUFfLkdIg/Nood-Listicles?node-id=0-1&t=OoGLYpfzbHTD4LYE-1',
  },
  {
    id: 18,
    title: "Grüns - I Tried the Grüns Gummies Everyone's Talking About – Here's My Honest Review",
    imageUrl: '/templates/Grüns Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/sgRyio7Cv5X8UBeir2QSCO/Gr%C3%BCns-Listicles?node-id=0-1&t=pPJaH5wqAJ5fYGnR-1',
  },
  {
    id: 19,
    title: 'OGEE - The Ultimate Glow Is Easy As 1-2-3',
    imageUrl: '/templates/Ogee Listicle 8.webp',
    figmaUrl: 'https://www.figma.com/design/dfRYm6Vgp2tlX4c4mkEqrQ/OGEE-Listicles?node-id=0-1&t=iJ1VFQw1Nu7OEPgI-1',
  },
  {
    id: 20,
    title: 'OGEE - The Ultimate Glow Is Just 3 Swipes Away',
    imageUrl: '/templates/Ogee Listicle 6.webp',
    figmaUrl: 'https://www.figma.com/design/dfRYm6Vgp2tlX4c4mkEqrQ/OGEE-Listicles?node-id=0-1&t=iJ1VFQw1Nu7OEPgI-1',
  },
  {
    id: 21,
    title: 'OGEE - Skincare-Infused Liquid Foundation',
    imageUrl: '/templates/Ogee Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/dfRYm6Vgp2tlX4c4mkEqrQ/OGEE-Listicles?node-id=0-1&t=iJ1VFQw1Nu7OEPgI-1',
  },
  {
    id: 22,
    title: 'Polish Pops - 5 REASONS WHY THOUSANDS OF WOMEN ARE SWITCHING TO GEL POLISH POPS',
    imageUrl: '/templates/Polishpops Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/BN3ll54zRFJ4luJpLqlzvz/Polishpops-Listicles?node-id=0-1&t=QKKM6OFSbAXqXgxf-1',
  },
  {
    id: 23,
    title: 'Downtoground - 8 Reasons Why Everyone Is Replacing Their Old Bedding with This Grounding Mattress Cover',
    imageUrl: '/templates/Downtoground Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/DnP6uKbsfuH9lcMhSEVhy5/Downtoground-Listicles?node-id=0-1&t=lrueH3rEXZgwaFwV-1',
  },
  {
    id: 24,
    title: 'Glowco - How People of All Ages Are Finding Relief from Insomnia & Anxiety with This Natural Solution – Backed by Over 2,500 Verified Reviews.',
    imageUrl: '/templates/GlowCo Listicle 2.webp',
    figmaUrl: 'https://www.figma.com/design/4krSiZfgvl9FLZ8cAXBtnW/GlowCo-Listicles?node-id=0-1&t=i0e7RoG9uOeh9Cdi-1',
  },
  {
    id: 25,
    title: "Hostage Tape - 10 Reasons You're Not Lazy, You're Just Breathing Wrong.",
    imageUrl: '/templates/Hostage Tape Listicle.webp',
    figmaUrl: 'https://www.figma.com/design/g4LFHjenHXpnCPIT8R6Xed/Hostage-Tape-Listicles?node-id=0-1&t=SFvs95pAy6GMfZ5c-1',
  },
  {
    id: 26,
    title: "Hostage Tape - 10 Reasons You're Not Lazy, You're Just Breathing Wrong.",
    imageUrl: '/templates/Hostage Tape Listicle 1.1.webp',
    figmaUrl: 'https://www.figma.com/design/g4LFHjenHXpnCPIT8R6Xed/Hostage-Tape-Listicles?node-id=0-1&t=SFvs95pAy6GMfZ5c-1',
  },
  {
    id: 27,
    title: 'Hostage Tape - 10 Reasons 150,000 Guys Love Hostage Tape (and Wake Up Ready to Crush It)',
    imageUrl: '/templates/Hostage Tape Listicle 3.webp',
    figmaUrl: 'https://www.figma.com/design/g4LFHjenHXpnCPIT8R6Xed/Hostage-Tape-Listicles?node-id=0-1&t=SFvs95pAy6GMfZ5c-1',
  },
  {
    id: 28,
    title: 'Jones Road Beauty - Additional Template',
    imageUrl: '/templates/Jones Road Beauty Listicle 3.webp',
    figmaUrl: 'https://www.figma.com/design/2U1YYG3JCuaOLEUir9iC6x/Jones-Road-Beauty-Listicles?node-id=0-1&t=TgPXCAkJ2Wcn9men-1',
  },
];

export default function TemplatesGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          8-9 Figure Brand Listicle Templates
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Download proven listicle designs from top-performing brands. Click on any template to access the Figma file.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            title={template.title}
            imageUrl={template.imageUrl}
            figmaUrl={template.figmaUrl}
          />
        ))}
      </div>
    </div>
  );
}

