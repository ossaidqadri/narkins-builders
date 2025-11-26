# TinaCMS Documentation

## Overview

TinaCMS is the headless content management system powering Narkins Builders' content editing capabilities. It provides a Git-based workflow with visual editing capabilities for both technical and non-technical team members.

## System Architecture

### Content Storage Model
```
Git Repository (main branch)
├── content/
│   ├── blogs/           # Blog posts in MDX format
│   │   ├── post-1.mdx
│   │   └── post-2.mdx
│   └── faqs/            # FAQ collections in JSON
│       ├── general.json
│       └── investment.json
├── tina/
│   ├── config.ts        # Schema definitions
│   ├── database.ts      # Database adapter
│   └── __generated__/   # Auto-generated files
└── public/
    └── admin/           # TinaCMS admin interface
```

### CMS Workflow
```
Content Editor → TinaCMS Admin → Git Commit → Build Trigger → Site Update
     ↓              ↓              ↓            ↓             ↓
Visual Editor   Schema Validation  Version Control  CI/CD    Live Site
```

## Configuration

### Core Configuration
```typescript
// tina/config.ts
export default defineConfig({
  branch: 'main',
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ['eng'],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [/* Collection definitions */]
  }
});
```

### Environment Variables
```bash
# Required for TinaCMS
NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_token
TINA_SEARCH_TOKEN=your_search_token  # Optional for search
```

## Content Collections

### 1. Blog Collection

Schema Definition:
```typescript
{
  name: 'blog',
  label: 'Blog Posts',
  path: 'content/blogs',
  format: 'mdx',
  ui: {
    filename: {
      readonly: true,
      slugify: (values) => {
        return `${values?.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
      },
    },
  },
  fields: [
    // Title field
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      isTitle: true,
      required: true,
      searchable: true,
    },
    // SEO fields
    {
      type: 'string',
      name: 'metaDescription',
      label: 'Meta Description',
      ui: {
        component: 'textarea',
        validate: (value) => {
          if (value && value.length > 160) {
            return 'Meta description should be 160 characters or less'
          }
        }
      }
    },
    // Publishing fields
    {
      type: 'datetime',
      name: 'publishDate',
      label: 'Publish Date',
      required: true,
    },
    {
      type: 'boolean',
      name: 'published',
      label: 'Published',
      required: true,
    },
    // Content editing mode
    {
      type: 'string',
      name: 'editingMode',
      label: 'Editing Mode',
      options: ['visual', 'raw'],
      required: true,
    },
    // Visual editor content
    {
      type: 'rich-text',
      name: 'body',
      label: 'Content (Visual Editor)',
      isBody: true,
      templates: [/* Rich text templates */]
    },
    // Raw MDX content
    {
      type: 'string',
      name: 'rawContent',
      label: 'Content (Raw MDX)',
      ui: {
        component: 'textarea',
        rows: 20,
      }
    }
  ]
}
```

### 2. Rich Text Templates

FAQ Section Template:
```typescript
{
  name: 'faqSection',
  label: 'FAQ Section',
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Section Title',
      required: true,
    },
    {
      type: 'string',
      name: 'faqCollection',
      label: 'FAQ Collection',
      options: [
        { value: 'firstTimeBuyer', label: 'First Time Buyer FAQs' },
        { value: 'investment', label: 'Investment Guide FAQs' },
        { value: 'twoBedroomApartments', label: 'Two Bedroom FAQs' },
        { value: 'luxuryApartments', label: 'Luxury Apartments FAQs' },
        { value: 'generalRealEstate', label: 'General Real Estate FAQs' },
        { value: 'hillCrestResidency', label: 'Hill Crest Residency FAQs' },
        { value: 'boutiqueResidency', label: 'Boutique Residency FAQs' },
        { value: 'apartmentSale', label: 'Apartment Sale FAQs' }
      ],
      required: true,
    }
  ]
}
```

Call to Action Template:
```typescript
{
  name: 'callToAction',
  label: 'Call to Action',
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      required: true,
    },
    {
      type: 'string',
      name: 'description',
      label: 'Description',
      ui: { component: 'textarea' }
    },
    {
      type: 'string',
      name: 'buttonText',
      label: 'Button Text',
      required: true,
    },
    {
      type: 'string',
      name: 'buttonUrl',
      label: 'Button URL',
      required: true,
    },
    {
      type: 'string',
      name: 'style',
      label: 'Style',
      options: ['primary', 'secondary', 'outline'],
      required: true,
    }
  ]
}
```

## Dual Editing System

### Visual Editor Mode
For Non-Technical Users:

1. Access: Visit `/admin` to access TinaCMS
2. Navigation: Go to "Blog Posts" collection
3. Create/Edit: Choose "Visual Editor" mode
4. Components: Use pre-built components:
   - FAQ sections with predefined collections
   - Call-to-action blocks
   - Property showcase cards
   - Market data tables

Benefits:
- No coding required
- WYSIWYG editing experience
- Predefined components ensure consistency
- Automatic schema validation

### Raw MDX Mode
For Technical Users:

1. Access: TinaCMS admin or direct file editing
2. Mode: Set "Editing Mode" to "Raw MDX"
3. Content: Write complete MDX with full control
4. Components: Access to all React components

Example Raw MDX:
```mdx
---
title: "Market Analysis Blog Post"
editingMode: "raw"
publishDate: "2025-01-15"
published: true
---

import { FAQ } from '@/components/features/faq/faq'
import { firstTimeBuyerFAQs } from '@/data/faq-data'

# Market Analysis for 2025

This is a comprehensive analysis of the real estate market.

<FAQ 
  staticFaqs={firstTimeBuyerFAQs}
  pageUrl="https://www.narkinsbuilders.com/blog/market-analysis-2025"
  contextType="property"
  title="Frequently Asked Questions"
/>
```

## Media Management

### Image Handling
```typescript
// Media configuration
media: {
  tina: {
    mediaRoot: 'images',      // Storage path: public/images/
    publicFolder: 'public',   // Public folder reference
  },
}
```

Upload Process:
1. Admin Interface: Drag and drop images in TinaCMS
2. Automatic Processing: Images saved to `public/images/`
3. Optimization: Next.js Image component handles optimization
4. CDN Delivery: Vercel CDN serves optimized images

### File Organization
```
public/images/
├── blog-images/          # Blog post images
├── amenities/           # Property amenity photos
│   ├── hill-crest-residency/
│   └── narkins-boutique-residency/
├── testimonials/        # Customer testimonial images
└── trusted-partners/    # Partner company logos
```

## Content Workflow

### 1. Content Creation Process
```
Content Planning → Draft Creation → Review Process → Publishing → Distribution
      ↓                ↓               ↓              ↓            ↓
Requirements     TinaCMS Editor    Team Review    Git Commit    Site Build
```

### 2. Version Control Integration
- Automatic Commits: TinaCMS commits changes to Git
- Branch Management: All edits go to main branch
- Change History: Full Git history for content changes
- Rollback Capability: Git-based rollback for content

### 3. Build Integration
```bash
# Build process
tinacms build → Schema Generation → Next.js Build → Deployment
```

## Advanced Features

### 1. Search Integration
```typescript
search: {
  tina: {
    indexerToken: process.env.TINA_SEARCH_TOKEN,
    stopwordLanguages: ['eng'],
  },
  indexBatchSize: 100,
  maxSearchIndexFieldLength: 100,
}
```

Search Capabilities:
- Full-text search across all content
- Automatic indexing of new content
- Search filtering by collection type
- Real-time search suggestions

### 2. Content Validation
```typescript
// Field validation example
ui: {
  validate: (value) => {
    if (value && value.length > 160) {
      return 'Meta description should be 160 characters or less'
    }
  }
}
```

Validation Features:
- Required field validation
- Character limit enforcement
- URL format validation
- Date format validation
- Custom business rule validation

### 3. Internationalization Support
```typescript
// Future i18n configuration
{
  type: 'string',
  name: 'language',
  label: 'Language',
  options: ['en', 'ur'],
  required: true,
}
```

## Security & Permissions

### 1. Authentication
- Client ID: Public identifier for TinaCMS app
- Token: Secure token for API access
- Branch Protection: Main branch protection rules
- User Permissions: Role-based access control

### 2. Content Security
- Schema Validation: Prevents invalid content structure
- Input Sanitization: Safe HTML/MDX rendering
- File Type Restrictions: Limited to safe file types
- Size Limits: Prevents large file uploads

## Performance Optimization

### 1. Build Performance
- Incremental Builds: Only rebuild changed content
- Parallel Processing: Concurrent schema generation
- Caching: Compiled schema caching
- Bundle Optimization: Tree-shaking unused components

### 2. Runtime Performance
- Static Generation: Pre-built content at build time
- CDN Caching: Global content distribution
- Image Optimization: Automatic WebP conversion
- Code Splitting: Component-level splitting

## Troubleshooting

### Common Issues

TinaCMS Build Errors:
```bash
# Clear generated files
rm -rf .tina/__generated__

# Rebuild schema
bun run tina:build

# Verify configuration
bunx @tinacms/cli status
```

Schema Validation Errors:
```bash
# Check schema syntax
bunx @tinacms/cli audit

# Regenerate types
bunx @tinacms/cli dev --local
```

Content Not Updating:
```bash
# Force rebuild
bunx @tinacms/cli build --clean

# Check Git status
git status
git log --oneline -5
```

### Debugging Tips

1. Admin Interface Issues:
   - Check browser console for errors
   - Verify environment variables
   - Clear browser cache

2. Content Rendering Issues:
   - Validate MDX syntax
   - Check component imports
   - Verify data structure

3. Build Issues:
   - Check TinaCMS configuration
   - Verify Git repository state
   - Review build logs

## Migration & Backup

### Content Migration
```bash
# Export content
bunx @tinacms/cli export --format=json

# Import content
bunx @tinacms/cli import --source=backup.json
```

### Backup Strategy
- Git Repository: Full version history
- Database Backup: Regular exports
- Media Backup: File system snapshots
- Configuration Backup: Environment variables

## Future Enhancements

### Planned Features
1. Multi-language Support: Urdu content management
2. Advanced Workflows: Approval processes
3. Scheduled Publishing: Time-based content release
4. Content Analytics: Usage metrics integration
5. API Extensions: Custom field types