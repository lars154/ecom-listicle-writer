#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../public/templates');
const OUTPUT_DIR = path.join(__dirname, '../public/templates-optimized');

// Configuration
const MAX_WIDTH = 600; // Max width for thumbnails
const QUALITY = 80; // WebP quality (0-100)

async function optimizeImages() {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all PNG files
  const files = fs.readdirSync(INPUT_DIR).filter(file => 
    file.toLowerCase().endsWith('.png')
  );

  console.log(`Found ${files.length} images to optimize...\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputFileName = file.replace(/\.png$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    try {
      const originalStats = fs.statSync(inputPath);
      totalOriginalSize += originalStats.size;

      await sharp(inputPath)
        .resize(MAX_WIDTH, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const optimizedStats = fs.statSync(outputPath);
      totalOptimizedSize += optimizedStats.size;

      const originalSizeMB = (originalStats.size / 1024 / 1024).toFixed(2);
      const optimizedSizeKB = (optimizedStats.size / 1024).toFixed(0);
      const reduction = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);

      console.log(`✓ ${file}`);
      console.log(`  ${originalSizeMB}MB → ${optimizedSizeKB}KB (${reduction}% smaller)\n`);
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error.message);
    }
  }

  const totalOriginalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
  const totalOptimizedMB = (totalOptimizedSize / 1024 / 1024).toFixed(2);
  const totalReduction = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);

  console.log('═'.repeat(50));
  console.log(`\nTotal: ${totalOriginalMB}MB → ${totalOptimizedMB}MB (${totalReduction}% smaller)`);
  console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);
}

optimizeImages().catch(console.error);
