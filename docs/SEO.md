# SEO Documentation

## Overview

Narkins Builders implements comprehensive SEO strategies to maximize visibility in search engines, with a focus on local real estate search optimization and technical SEO excellence.

## Technical SEO Foundation

### 1. Core Web Vitals Optimization

Performance Targets:
```
Largest Contentful Paint (LCP): < 2.5s
First Input Delay (FID): < 100ms
Cumulative Layout Shift (CLS): < 0.1
First Contentful Paint (FCP): < 1.8s
Time to Interactive (TTI): < 3.8s
```

Implementation: Web Vitals are automatically tracked and sent to Google Analytics for performance monitoring.

> For complete performance monitoring implementation, see [DEPLOYMENT.md](./DEPLOYMENT.md#monitoring--analytics)

### 2. Next.js SEO Configuration

Meta Tags Implementation:
```tsx
// src/components/common/seo/seo-head.tsx
import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  keywords?: string[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  ogImage = '/images/narkins-builders-og-image.webp',
  ogType = 'website',
  publishDate,
  modifiedDate,
  author,
  keywords = [],
}) => {
  const fullTitle = `${title} | Narkin\'s Builders - Premium Real Estate Karachi`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.narkinsbuilders.com';
  const canonicalUrl = canonical || siteUrl;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Narkin's Builders" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Article-specific meta tags */}
      {ogType === 'article' && publishDate && (
        <meta property="article:published_time" content={publishDate} />
      )}
      {ogType === 'article' && modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}
      {ogType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content="Narkin's Builders" />
    </Head>
  );
};
```

## Structured Data Implementation

### 1. Schema.org Markup System

Organization Schema:
```tsx
// src/components/common/schema/organization-schema.tsx
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Narkin's Builders and Developers",
    "alternateName": "Narkin's Builders",
    "url": "https://www.narkinsbuilders.com",
    "logo": "https://www.narkinsbuilders.com/images/narkins-builders-logo.webp",
    "description": "Premium real estate developer in Bahria Town Karachi specializing in luxury apartments and residential projects with 30+ years of construction excellence.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bahria Town",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "postalCode": "75340",
      "addressCountry": "PK"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+92-320-324-3970",
        "contactType": "sales",
        "areaServed": "PK",
        "availableLanguage": ["English", "Urdu"]
      },
      {
        "@type": "ContactPoint",
        "email": "info@narkinsbuilders.com",
        "contactType": "customer service",
        "areaServed": "PK"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/narkinsbuilders",
      "https://www.linkedin.com/company/narkins-builders",
      "https://www.youtube.com/channel/UCxxxxx"
    ],
    "foundingDate": "1994",
    "numberOfEmployees": "50-100",
    "knowsAbout": [
      "Real Estate Development",
      "Luxury Apartments",
      "Residential Construction",
      "Property Investment",
      "Bahria Town Karachi"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

Local Business Schema:
```tsx
// src/components/common/schema/local-business-schema.tsx
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.narkinsbuilders.com/#organization",
    "name": "Narkin's Builders and Developers",
    "image": "https://www.narkinsbuilders.com/images/narkins-builders-logo.webp",
    "telephone": "+92-320-324-3970",
    "email": "info@narkinsbuilders.com",
    "url": "https://www.narkinsbuilders.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bahria Town",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "postalCode": "75340",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "24.8607",
      "longitude": "67.0011"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "PKR 5,000,000 - PKR 50,000,000",
    "currenciesAccepted": "PKR",
    "paymentAccepted": "Cash, Bank Transfer, Installments"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

Real Estate Listing Schema:
```tsx
// src/components/common/schema/real-estate-listing-schema.tsx
interface RealEstateListingProps {
  property: {
    name: string;
    description: string;
    price: number;
    currency: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    floorSize: number;
    images: string[];
    amenities: string[];
  };
}

export const RealEstateListingSchema: React.FC<RealEstateListingProps> = ({
  property
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.name,
    "description": property.description,
    "url": `https://www.narkinsbuilders.com/properties/${property.name.toLowerCase().replace(/\s+/g, '-')}`,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.currency,
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "addressCountry": "PK"
    },
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.floorSize,
      "unitCode": "SQF"
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "amenityFeature": property.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "photo": property.images.map(image => ({
      "@type": "ImageObject",
      "url": `https://www.narkinsbuilders.com${image}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

### 2. FAQ Schema Implementation

FAQ Schema for Property Pages:
```tsx
// src/components/common/schema/faq-schema.tsx
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
  pageUrl: string;
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs, pageUrl }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

### 3. Article Schema for Blog Posts

Blog Post Schema:
```tsx
// src/components/common/schema/blog-post-schema.tsx
interface BlogPostSchemaProps {
  title: string;
  description: string;
  publishDate: string;
  modifiedDate?: string;
  author: string;
  image: string;
  slug: string;
  wordCount: number;
  readingTime: number;
}

export const BlogPostSchema: React.FC<BlogPostSchemaProps> = ({
  title,
  description,
  publishDate,
  modifiedDate,
  author,
  image,
  slug,
  wordCount,
  readingTime
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": [`https://www.narkinsbuilders.com${image}`],
    "author": {
      "@type": "Organization",
      "name": "Narkin's Builders",
      "url": "https://www.narkinsbuilders.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Narkin's Builders",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.narkinsbuilders.com/images/narkins-builders-logo.webp"
      }
    },
    "datePublished": publishDate,
    "dateModified": modifiedDate || publishDate,
    "url": `https://www.narkinsbuilders.com/blog/${slug}`,
    "wordCount": wordCount,
    "timeRequired": `PT${readingTime}M`,
    "about": [
      "Real Estate",
      "Property Investment",
      "Bahria Town Karachi",
      "Luxury Apartments"
    ],
    "articleSection": "Real Estate Blog",
    "inLanguage": "en-US"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

## Content Optimization

### 1. Keyword Strategy

Primary Keywords:
- Real estate Karachi
- Apartments Bahria Town
- Luxury apartments Karachi
- Property investment Pakistan
- Residential projects Karachi

Long-tail Keywords:
- 2 bedroom apartments Bahria Town Karachi
- Hill Crest Residency floor plans
- Narkins Boutique Residency amenities
- Best real estate developer Karachi
- Gated community apartments Pakistan

Local SEO Keywords:
- Real estate developer Bahria Town
- Property for sale Karachi
- Luxury apartments near Safari Park
- Residential projects Sindh
- Construction company Karachi

### 2. Content Structure Optimization

Page Title Optimization:
```typescript
// src/lib/seo-utils.ts
export const generatePageTitle = (
  pageName: string, 
  location?: string, 
  propertyType?: string
): string => {
  const baseTitle = "Narkin's Builders - Premium Real Estate Karachi";
  
  if (pageName === 'home') {
    return `${baseTitle} | Luxury Apartments & Residential Projects`;
  }
  
  if (location && propertyType) {
    return `${pageName} | ${propertyType} in ${location} | ${baseTitle}`;
  }
  
  return `${pageName} | ${baseTitle}`;
};

// Usage examples:
// Homepage: "Narkin's Builders - Premium Real Estate Karachi | Luxury Apartments & Residential Projects"
// Property: "Hill Crest Residency | Luxury Apartments in Bahria Town | Narkin's Builders"
// Blog: "Real Estate Investment Guide 2025 | Narkin's Builders Blog"
```

Meta Description Templates:
```typescript
export const generateMetaDescription = (
  type: 'property' | 'blog' | 'page',
  content: {
    name?: string;
    location?: string;
    features?: string[];
    excerpt?: string;
  }
): string => {
  switch (type) {
    case 'property':
      return `Discover ${content.name} - luxury apartments in ${content.location} by Narkin's Builders. Features: ${content.features?.join(', ')}. Book your visit today!`;
    
    case 'blog':
      return `${content.excerpt} | Expert real estate insights from Narkin's Builders, Karachi's premier property developer.`;
    
    case 'page':
      return `${content.excerpt} Narkin's Builders - 30+ years of construction excellence in Karachi's premium real estate market.`;
    
    default:
      return "Narkin's Builders - Premium real estate developer specializing in luxury apartments and residential projects in Bahria Town, Karachi.";
  }
};
```

## Technical SEO Implementation

### 1. Sitemap Generation

Dynamic Sitemap:
```typescript
// src/pages/api/sitemap.xml.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllBlogPosts } from '@/lib/blog-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.narkinsbuilders.com';
    const blogPosts = await getAllBlogPosts();
    
    const staticPages = [
      {
        url: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: `${baseUrl}/hill-crest-residency`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        url: `${baseUrl}/narkins-boutique-residency`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        url: `${baseUrl}/about`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: `${baseUrl}/blog`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.8'
      },
      {
        url: `${baseUrl}/completed-projects`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.7'
      }
    ];

    const blogPages = blogPosts
      .filter(post => post.published)
      .map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.publishDate,
        changefreq: 'weekly',
        priority: '0.6'
      }));

    const allPages = [...staticPages, ...blogPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages.map(page => `
        <url>
          <loc>${page.url}</loc>
          <lastmod>${page.lastmod}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `).join('')}
    </urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemap.trim());
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).end();
  }
}
```

### 2. RSS Feed Implementation

Blog RSS Feed:
```typescript
// src/pages/api/rss.xml.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllBlogPosts } from '@/lib/blog-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.narkinsbuilders.com';
    const blogPosts = await getAllBlogPosts();
    
    const publishedPosts = blogPosts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 20); // Latest 20 posts

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Narkin's Builders Blog - Real Estate Insights</title>
        <description>Latest insights on real estate investment, property development, and market trends in Karachi, Pakistan from Narkin's Builders.</description>
        <link>${baseUrl}/blog</link>
        <language>en-us</language>
        <managingEditor>info@narkinsbuilders.com (Narkin's Builders)</managingEditor>
        <webMaster>info@narkinsbuilders.com (Narkin's Builders)</webMaster>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
        <image>
          <url>${baseUrl}/images/narkins-builders-logo.webp</url>
          <title>Narkin's Builders</title>
          <link>${baseUrl}</link>
        </image>
        ${publishedPosts.map(post => `
          <item>
            <title><![CDATA[${post.title}]]></title>
            <description><![CDATA[${post.metaDescription || post.excerpt}]]></description>
            <link>${baseUrl}/blog/${post.slug}</link>
            <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
            <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
            <author>info@narkinsbuilders.com (Narkin's Builders)</author>
            <category>Real Estate</category>
            ${post.featuredImage ? `<enclosure url="${baseUrl}${post.featuredImage}" type="image/webp"/>` : ''}
          </item>
        `).join('')}
      </channel>
    </rss>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(rss.trim());
  } catch (error) {
    console.error('RSS generation error:', error);
    res.status(500).end();
  }
}
```

### 3. Robots.txt Configuration

Public Robots.txt:
```
# https://www.narkinsbuilders.com/robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.narkinsbuilders.com/api/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /api/sitemap.xml
Allow: /api/rss.xml

# Crawl delay
Crawl-delay: 1
```

## Local SEO Optimization

### 1. Google My Business Integration

Business Information Schema:
```typescript
const businessInfo = {
  name: "Narkin's Builders and Developers",
  address: "Bahria Town, Karachi, Sindh 75340, Pakistan",
  phone: "+92-320-324-3970",
  email: "info@narkinsbuilders.com",
  website: "https://www.narkinsbuilders.com",
  businessHours: {
    monday: "09:00-18:00",
    tuesday: "09:00-18:00",
    wednesday: "09:00-18:00",
    thursday: "09:00-18:00",
    friday: "09:00-18:00",
    saturday: "10:00-16:00",
    sunday: "closed"
  },
  services: [
    "Real Estate Development",
    "Luxury Apartment Construction",
    "Property Investment Consultation",
    "Residential Project Management"
  ]
};
```

### 2. Location-Based Content

Location Landing Pages:
- `/bahria-town-karachi-real-estate`
- `/luxury-apartments-karachi`
- `/property-investment-pakistan`
- `/residential-projects-sindh`

Local Content Strategy:
```typescript
const localContentTopics = [
  "Best Areas to Buy Property in Karachi 2025",
  "Bahria Town vs DHA: Investment Comparison",
  "Real Estate Market Trends in Sindh",
  "Property Prices in Karachi: Complete Guide",
  "Infrastructure Development Impact on Property Values"
];
```

## Performance SEO

### 1. Image SEO Optimization

Image Optimization Strategy:
```tsx
// Optimized image component with SEO attributes
import Image from 'next/image';

interface SEOImageProps {
  src: string;
  alt: string;
  title?: string;
  width: number;
  height: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

export const SEOImage: React.FC<SEOImageProps> = ({
  src,
  alt,
  title,
  width,
  height,
  priority = false,
  loading = 'lazy'
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      priority={priority}
      loading={loading}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
      }}
    />
  );
};
```

Image Alt Text Standards:
```typescript
// src/data/image-alt-texts.ts
export const imageAltTexts = {
  properties: {
    hillCrest: {
      exterior: "Hill Crest Residency exterior view - luxury apartment building in Bahria Town Karachi by Narkin's Builders",
      lobby: "Hill Crest Residency grand lobby with marble flooring and modern lighting",
      amenities: {
        gym: "Hill Crest Residency modern fitness center with latest equipment",
        pool: "Hill Crest Residency swimming pool area with deck chairs"
      }
    },
    narkinsBoutique: {
      exterior: "Narkins Boutique Residency facade - premium residential tower overlooking Heritage Commercial Area",
      floorPlans: "Narkins Boutique Residency 3-bedroom apartment floor plan showing spacious layout"
    }
  },
  company: {
    logo: "Narkin's Builders logo - Premier real estate developer in Karachi with 30+ years experience",
    team: "Narkin's Builders construction and development team at project site",
    awards: "Narkin's Builders excellence awards for outstanding real estate development"
  }
};
```

### 2. Core Web Vitals Optimization

Performance Monitoring:
```typescript
// src/lib/performance.ts
export const measurePerformance = () => {
  if (typeof window !== 'undefined') {
    // Measure LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      // Send to analytics
      gtag('event', 'LCP', {
        event_category: 'Web Vitals',
        value: Math.round(lastEntry.startTime),
        non_interaction: true,
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Measure CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      
      gtag('event', 'CLS', {
        event_category: 'Web Vitals',
        value: Math.round(clsValue * 1000),
        non_interaction: true,
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
};
```

## Analytics & Monitoring

### 1. SEO Analytics Tracking

Google Analytics 4 Events:
```typescript
// src/lib/gtag.ts
export const trackSEOEvents = {
  searchQuery: (query: string) => {
    gtag('event', 'search', {
      search_term: query,
      event_category: 'SEO',
    });
  },

  pageView: (url: string, title: string) => {
    gtag('config', GA_TRACKING_ID, {
      page_title: title,
      page_location: url,
    });
  },

  propertyInquiry: (propertyName: string, source: string) => {
    gtag('event', 'property_inquiry', {
      event_category: 'Lead Generation',
      event_label: propertyName,
      custom_parameter_1: source,
    });
  },

  blogEngagement: (action: string, postTitle: string) => {
    gtag('event', action, {
      event_category: 'Blog Engagement',
      event_label: postTitle,
    });
  }
};
```

### 2. Search Console Integration

Search Console Data Tracking:
```typescript
// Track search performance metrics
export const searchConsoleMetrics = {
  topQueries: [
    "apartments bahria town karachi",
    "real estate karachi",
    "luxury apartments pakistan",
    "property investment karachi",
    "hill crest residency"
  ],
  
  averagePosition: 3.2,
  clickThroughRate: 4.8,
  impressions: 125000,
  clicks: 6000
};
```

## SEO Maintenance & Monitoring

### 1. Regular SEO Audits

Monthly SEO Checklist:
- [ ] Core Web Vitals performance
- [ ] Search Console error monitoring
- [ ] Broken link detection
- [ ] Meta tag optimization review
- [ ] Schema markup validation
- [ ] Mobile usability testing
- [ ] Page speed analysis
- [ ] Keyword ranking tracking

### 2. Content Optimization Process

Content Update Schedule:
- Weekly: Blog post publication with SEO optimization
- Monthly: Property page content updates
- Quarterly: Comprehensive keyword research and content audit
- Annually: Complete SEO strategy review and planning

SEO Content Guidelines:
1. Target keyword density: 1-2%
2. Meta description length: 150-160 characters
3. Title tag length: 50-60 characters
4. H1 tag: One per page, include primary keyword
5. H2-H6 tags: Use hierarchically with secondary keywords
6. Internal linking: 3-5 relevant internal links per page
7. External linking: 1-2 authoritative external sources
8. Image optimization: All images with descriptive alt text
9. Schema markup: Implement relevant structured data
10. Mobile optimization: Ensure responsive design and fast loading