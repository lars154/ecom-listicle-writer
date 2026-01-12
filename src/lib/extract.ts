import * as cheerio from 'cheerio';
import type { ProductBrief } from './types';

export async function extractFromUrl(url: string): Promise<ProductBrief> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Detect page type
  const pageType = detectPageType(url, $);

  // Extract basic info
  const title = extractTitle($);
  const brand = extractBrand($);
  const price = extractPrice($);
  const description = extractDescription($);
  
  // Extract category hints (important for context)
  const categoryHints = extractCategoryHints($, title, description);
  
  // Extract benefits and claims
  let benefits = extractBenefits($);
  let claims = extractClaims($);
  
  // Fallback: if we found very little, try extracting from all visible text
  if (benefits.length < 3 && claims.length < 3) {
    console.warn('Low extraction yield - applying fallback text mining');
    const fallbackContent = extractFallbackContent($);
    benefits = [...benefits, ...fallbackContent.benefits];
    claims = [...claims, ...fallbackContent.claims];
  }
  
  // Extract ingredients/specs
  const ingredients = extractIngredients($);
  const specs = extractSpecs($);
  
  // Extract reviews
  const reviews = extractReviews($);
  
  // Extract FAQs
  const faqs = extractFaqs($);

  return {
    url,
    pageType,
    title,
    brand,
    price,
    description,
    categoryHints,
    benefits: [...new Set(benefits)].slice(0, 15),
    claims: [...new Set(claims)].slice(0, 12),
    ingredients,
    specs,
    reviews,
    faqs,
  };
}

function extractFallbackContent($: cheerio.CheerioAPI): { benefits: string[]; claims: string[] } {
  const benefits: string[] = [];
  const claims: string[] = [];
  
  // Remove noise elements
  $('script, style, nav, header, footer, .menu, .navigation, [class*="cookie"]').remove();
  
  // Get main content area
  const mainContent = $('main, [role="main"], .main, .content, article, .product').first();
  const searchRoot = mainContent.length > 0 ? mainContent : $('body');
  
  // Extract sentences that look like benefits or claims
  const allText = searchRoot.text();
  const sentences = allText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 250);
  
  sentences.forEach(sentence => {
    const lower = sentence.toLowerCase();
    
    // Benefit indicators
    if (
      lower.includes('perfect for') ||
      lower.includes('ideal for') ||
      lower.includes('designed to') ||
      lower.includes('helps you') ||
      lower.includes('allows you') ||
      lower.includes('makes it easy') ||
      lower.includes('great for') ||
      lower.match(/you can|you'll|you will/)
    ) {
      benefits.push(sentence);
    }
    
    // Claim indicators
    if (
      sentence.match(/\d+%|\d+x|\d+\+/) ||
      lower.match(/proven|tested|certified|guaranteed|rated|award|patent/)
    ) {
      claims.push(sentence);
    }
  });
  
  return {
    benefits: benefits.slice(0, 10),
    claims: claims.slice(0, 8),
  };
}

function extractCategoryHints($: cheerio.CheerioAPI, title: string, description?: string): string[] {
  const hints = new Set<string>();
  
  // Combine title + description for keyword analysis
  const textToAnalyze = `${title} ${description || ''}`.toLowerCase();
  
  // Category keyword patterns
  const categoryPatterns: Record<string, string[]> = {
    'Pokemon/Trading Cards': ['pokemon', 'tcg', 'trading card', 'card game', 'trainer', 'deck', 'collection', 'booster', 'charizard', 'pikachu'],
    'Fitness/Gym': ['workout', 'exercise', 'gym', 'fitness', 'training', 'muscle', 'weight', 'cardio', 'yoga', 'athletic'],
    'Beauty/Skincare': ['skin', 'beauty', 'makeup', 'serum', 'moisturizer', 'anti-aging', 'wrinkle', 'glow', 'complexion'],
    'Home/Kitchen': ['kitchen', 'cooking', 'cookware', 'home', 'decor', 'furniture', 'cleaning', 'appliance'],
    'Tech/Electronics': ['tech', 'electronic', 'gadget', 'device', 'smart', 'wireless', 'bluetooth', 'charging'],
    'Fashion/Accessories': ['fashion', 'clothing', 'apparel', 'accessory', 'jewelry', 'watch', 'style', 'wear'],
    'Pet Products': ['pet', 'dog', 'cat', 'animal', 'puppy', 'kitten', 'fur baby'],
    'Baby/Kids': ['baby', 'infant', 'toddler', 'kids', 'children', 'nursery', 'parenting'],
  };
  
  // Check for category matches
  for (const [category, keywords] of Object.entries(categoryPatterns)) {
    for (const keyword of keywords) {
      if (textToAnalyze.includes(keyword)) {
        hints.add(category);
        hints.add(keyword); // Also add the specific keyword
        break;
      }
    }
  }
  
  // Extract product type from meta tags
  const productType = $('meta[property="product:category"]').attr('content') ||
    $('meta[property="og:type"]').attr('content');
  
  if (productType) {
    hints.add(productType);
  }
  
  // Extract from breadcrumbs
  $('.breadcrumb a, .breadcrumbs a, [itemtype="https://schema.org/BreadcrumbList"] a').each((_, el) => {
    const crumb = $(el).text().trim().toLowerCase();
    if (crumb.length > 2 && crumb.length < 30) {
      hints.add(crumb);
    }
  });
  
  return Array.from(hints).slice(0, 10);
}

function detectPageType(url: string, $: cheerio.CheerioAPI): 'product' | 'landing' | 'unknown' {
  if (url.includes('/products/')) return 'product';
  if (url.includes('/pages/')) return 'landing';
  
  // Check for Shopify product meta
  if ($('meta[property="og:type"]').attr('content') === 'product') return 'product';
  
  // Check for product schema
  const ldJson = $('script[type="application/ld+json"]').text();
  if (ldJson.includes('"@type":"Product"')) return 'product';
  
  return 'landing';
}

function extractTitle($: cheerio.CheerioAPI): string {
  // Strategy 1: Product-specific title selectors
  const productTitle = $(
    '.product-title, .product__title, [itemprop="name"], ' +
    '.product-name, .product__name, [class*="product-title"]'
  ).first().text().trim();
  
  if (productTitle && productTitle.length > 3) return productTitle;
  
  // Strategy 2: Main H1
  const h1 = $('h1').first().text().trim();
  if (h1 && h1.length > 3) return h1;
  
  // Strategy 3: Meta tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  if (ogTitle && ogTitle.length > 3) return ogTitle;
  
  // Strategy 4: Page title (clean up)
  const pageTitle = $('title').text().trim();
  if (pageTitle) {
    // Remove common suffixes
    return pageTitle
      .replace(/\s*[-–|]\s*.+$/, '') // Remove "- Store Name" etc
      .trim() || pageTitle;
  }
  
  return 'Untitled Product';
}

function extractBrand($: cheerio.CheerioAPI): string | undefined {
  const brandMeta = $('meta[property="og:brand"]').attr('content');
  if (brandMeta) return brandMeta;
  
  // Try to find brand in JSON-LD
  const ldJson = $('script[type="application/ld+json"]').text();
  const brandMatch = ldJson.match(/"brand":\s*"([^"]+)"/);
  if (brandMatch) return brandMatch[1];
  
  // Try common Shopify selectors
  const shopifyBrand = $('.product-vendor, .product__vendor, [itemprop="brand"]').first().text().trim();
  if (shopifyBrand) return shopifyBrand;
  
  return undefined;
}

function extractPrice($: cheerio.CheerioAPI): string | undefined {
  // Try meta tags
  const priceMeta = $('meta[property="og:price:amount"]').attr('content');
  if (priceMeta) {
    const currency = $('meta[property="og:price:currency"]').attr('content') || 'USD';
    return `${currency} ${priceMeta}`;
  }
  
  // Try common price selectors
  const priceText = $(
    '.product-price, .price, .product__price, [itemprop="price"], .money'
  ).first().text().trim();
  
  return priceText || undefined;
}

function extractDescription($: cheerio.CheerioAPI): string | undefined {
  const descriptions: string[] = [];
  
  // Strategy 1: Meta descriptions
  const metaDesc = $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content');
  if (metaDesc && metaDesc.length > 30) {
    descriptions.push(metaDesc);
  }
  
  // Strategy 2: Structured product/page descriptions
  $(
    '.product-description, .product__description, [itemprop="description"], ' +
    '.description, .product-info, .product-content, .product-details, ' +
    '[class*="description"], [class*="about"], .rte'
  ).each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 50 && text.length < 2000) {
      descriptions.push(text);
    }
  });
  
  // Strategy 3: First few substantial paragraphs on the page
  if (descriptions.length === 0) {
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      // Substantial paragraph, not footer/nav text
      if (text.length > 50 && text.length < 800 && !isNavigationText(text)) {
        descriptions.push(text);
        if (descriptions.length >= 3) return false; // Stop after 3
      }
    });
  }
  
  // Strategy 4: Combine first heading with following content
  if (descriptions.length === 0) {
    const h1 = $('h1').first().text().trim();
    const nextP = $('h1').first().nextAll('p').first().text().trim();
    if (h1 && nextP) {
      descriptions.push(`${h1}. ${nextP}`);
    }
  }
  
  // Dedupe and combine (limit to ~1000 chars)
  const combined = [...new Set(descriptions)]
    .join(' ')
    .slice(0, 1000);
  
  return combined.length > 30 ? combined : undefined;
}

function extractBenefits($: cheerio.CheerioAPI): string[] {
  const benefits = new Set<string>();
  
  // Strategy 1: Find ALL bullet points on the page (cast wide net)
  $('ul li, ol li').each((_, el) => {
    const text = $(el).text().trim();
    // Valid benefit: substantive sentence, not navigation
    if (text.length > 15 && text.length < 250 && !isNavigationText(text)) {
      benefits.add(text);
    }
  });
  
  // Strategy 2: Find paragraphs near keywords like "perfect for", "ideal for", "great for"
  $('p').each((_, el) => {
    const text = $(el).text().trim();
    const lower = text.toLowerCase();
    if (
      (lower.includes('perfect for') || 
       lower.includes('ideal for') || 
       lower.includes('great for') ||
       lower.includes('designed to') ||
       lower.includes('helps you') ||
       lower.includes('allows you to')) &&
      text.length > 20 && 
      text.length < 300
    ) {
      benefits.add(text);
    }
  });
  
  // Strategy 3: Extract from structured sections with common benefit headings
  const benefitHeadings = ['features', 'benefits', 'why', 'what', 'includes', 'specifications', 'details', 'about'];
  $('h1, h2, h3, h4, h5, h6, strong, b').each((_, el) => {
    const heading = $(el).text().toLowerCase().trim();
    
    if (benefitHeadings.some(keyword => heading.includes(keyword))) {
      // Get next sibling content
      let nextEl = $(el).next();
      let attempts = 0;
      
      while (nextEl.length && attempts < 5) {
        if (nextEl.is('ul, ol')) {
          nextEl.find('li').each((_, li) => {
            const text = $(li).text().trim();
            if (text.length > 15 && text.length < 250) {
              benefits.add(text);
            }
          });
          break;
        } else if (nextEl.is('p')) {
          const text = nextEl.text().trim();
          if (text.length > 20 && text.length < 300) {
            benefits.add(text);
          }
        }
        nextEl = nextEl.next();
        attempts++;
      }
    }
  });
  
  // Strategy 4: Look for icon/feature grids (common pattern)
  $('.feature, .benefit, [class*="feature"], [class*="benefit"], [class*="icon"]').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 15 && text.length < 250 && !isNavigationText(text)) {
      benefits.add(text);
    }
  });
  
  return Array.from(benefits).slice(0, 15);
}

function isNavigationText(text: string): boolean {
  const lower = text.toLowerCase();
  const navPatterns = [
    'home', 'shop', 'cart', 'account', 'login', 'sign in', 'menu',
    'search', 'checkout', 'shipping', 'terms', 'privacy', 'contact',
    'instagram', 'facebook', 'twitter', 'subscribe', 'newsletter'
  ];
  
  // Navigation is usually very short or contains nav keywords
  if (text.length < 15) return true;
  return navPatterns.some(pattern => lower === pattern || lower.startsWith(pattern + ' '));
}

function extractClaims($: cheerio.CheerioAPI): string[] {
  const claims = new Set<string>();
  
  // Claim indicators
  const claimPatterns = [
    /\d+%/, // Percentages
    /\d+x/, // Multipliers (3x stronger, 5x faster)
    /\d+\+/, // Numbers with + (100+ reviews, 5+ years)
    /proven/i,
    /clinically/i,
    /dermatologist/i,
    /doctor/i,
    /tested/i,
    /certified/i,
    /award/i,
    /patent/i,
    /guaranteed/i,
    /scientific/i,
    /research/i,
    /study shows/i,
    /rated/i,
    /recommended by/i,
  ];
  
  // Search in all text elements
  $('p, li, div, span').each((_, el) => {
    const text = $(el).text().trim();
    
    // Must be substantive but not too long
    if (text.length < 20 || text.length > 250) return;
    if (isNavigationText(text)) return;
    
    // Check if contains claim pattern
    const hasClaim = claimPatterns.some(pattern => pattern.test(text));
    
    if (hasClaim) {
      claims.add(text);
    }
  });
  
  // Also look for bold/strong statements (often claims)
  $('strong, b, .highlight, [class*="highlight"]').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 15 && text.length < 200 && !isNavigationText(text)) {
      claims.add(text);
    }
  });
  
  return Array.from(claims).slice(0, 12);
}

function extractIngredients($: cheerio.CheerioAPI): string[] | undefined {
  const ingredients: string[] = [];
  
  // Look for ingredients section
  $('h2, h3, h4').each((_, el) => {
    const heading = $(el).text().toLowerCase();
    if (heading.includes('ingredient')) {
      $(el).nextAll('ul, ol').first().find('li').each((_, li) => {
        ingredients.push($(li).text().trim());
      });
    }
  });
  
  return ingredients.length > 0 ? ingredients : undefined;
}

function extractSpecs($: cheerio.CheerioAPI): Record<string, string> | undefined {
  const specs: Record<string, string> = {};
  
  // Look for spec tables
  $('table').each((_, table) => {
    $(table).find('tr').each((_, row) => {
      const cells = $(row).find('td, th');
      if (cells.length === 2) {
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        if (key && value && key.length < 50 && value.length < 100) {
          specs[key] = value;
        }
      }
    });
  });
  
  return Object.keys(specs).length > 0 ? specs : undefined;
}

function extractReviews($: cheerio.CheerioAPI): ProductBrief['reviews'] {
  const reviews: ProductBrief['reviews'] = {};
  
  // Try to extract review count
  const reviewCountText = $('.review-count, .product-reviews__count, [itemprop="reviewCount"]').first().text();
  const countMatch = reviewCountText.match(/(\d+[\d,]*)/);
  if (countMatch) {
    reviews.count = parseInt(countMatch[1].replace(/,/g, ''));
  }
  
  // Try to extract rating
  const ratingText = $('.rating, .product-rating, [itemprop="ratingValue"]').first().text();
  const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
  if (ratingMatch) {
    reviews.rating = parseFloat(ratingMatch[1]);
  }
  
  // Extract review snippets
  const snippets: string[] = [];
  $('.review-text, .review-body, [itemprop="reviewBody"]').slice(0, 6).each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 20 && text.length < 300) {
      snippets.push(text);
    }
  });
  
  if (snippets.length > 0) {
    reviews.snippets = snippets;
  }
  
  return Object.keys(reviews).length > 0 ? reviews : undefined;
}

function extractFaqs($: cheerio.CheerioAPI): ProductBrief['faqs'] {
  const faqs: Array<{ question: string; answer: string }> = [];
  
  // Look for FAQ sections
  $('h2, h3, h4').each((_, el) => {
    const heading = $(el).text().toLowerCase();
    if (heading.includes('faq') || heading.includes('question')) {
      // Look for accordion or details elements
      $(el).parent().find('details, .accordion-item, .faq-item').each((_, item) => {
        const question = $(item).find('summary, .question, .accordion-header').first().text().trim();
        const answer = $(item).find('.answer, .accordion-body, p').first().text().trim();
        
        if (question && answer && answer.length > 10) {
          faqs.push({ question, answer });
        }
      });
    }
  });
  
  return faqs.length > 0 ? faqs : undefined;
}

