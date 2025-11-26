# Architecture Documentation

## System Overview

Narkins Builders is a modern real estate platform built with Next.js 15, featuring a comprehensive content management system, progressive web app capabilities, and advanced real estate business features.

## Architecture Patterns

### 1. Full-Stack Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Layer  │    │  Service Layer  │    │   Data Layer    │
│                 │    │                 │    │                 │
│ • Next.js SSR   │◄──►│ • TinaCMS       │◄──►│ • MySQL DB      │
│ • PWA Features  │    │ • Google Sheets │    │ • File System   │
│ • Service Worker│    │ • Analytics     │    │ • External APIs │
│ • Client State  │    │ • Auth Layer    │    │ • Git Storage   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. Component Architecture
```
src/
├── components/
│   ├── common/          # Shared utilities
│   │   ├── schema/      # SEO structured data
│   │   ├── seo-image/   # SEO image generation
│   │   ├── typography/  # Text components
│   │   └── ui/          # Base UI components (shadcn/ui)
│   ├── features/        # Business logic components
│   │   ├── blog/        # Blog functionality
│   │   ├── lead-form/   # Lead generation
│   │   ├── pwa-install/ # PWA installation
│   │   └── video-player/# Custom video player
│   └── layout/          # Layout components
       ├── footer/       # Site footer
       └── navigation/   # Main navigation
```

### 3. Data Flow Architecture

#### Content Management Flow
```
TinaCMS Admin → Git Repository → Build Process → Static Generation → CDN
     ↓                ↓              ↓               ↓           ↓
Visual Editor    Version Control   TinaCMS Build   Next.js     Vercel
```

#### User Interaction Flow
```
User Request → Next.js Router → Page Component → Data Fetching → Rendering
     ↓              ↓              ↓               ↓            ↓
Analytics    Route Handler    Business Logic   Database      Response
```

## Core Systems

### 1. Next.js App Router System

File Structure:
```
src/pages/
├── _app.tsx           # App wrapper with providers
├── _document.tsx      # HTML document structure
├── index.tsx          # Homepage
├── api/               # API routes
│   ├── sheets.ts      # Google Sheets integration
│   ├── share.ts       # PWA share target
│   ├── rss.xml.ts     # RSS feed generation
│   └── sitemap.xml.ts # Sitemap generation
├── blog/
│   ├── index.tsx      # Blog listing
│   └── [slug].tsx     # Individual blog posts
└── [project-pages]/   # Property project pages
```

Key Features:
- Server-Side Rendering (SSR) for SEO optimization
- Static Site Generation (SSG) with Incremental Static Regeneration (ISR)
- API routes for backend functionality
- Dynamic routing for blog posts and projects

### 2. Content Management System (TinaCMS)

Configuration:
> For complete TinaCMS configuration details, see [CMS.md](./CMS.md#core-configuration)

Content Flow:
1. Content creators use visual editor at `/admin`
2. Changes are committed to Git repository
3. Build process regenerates static content
4. CDN serves updated content

### 3. Progressive Web App (PWA) System

PWA Implementation: Progressive Web App with intelligent caching, offline functionality, and native app-like features.

> For complete PWA implementation details, service worker code, and installation components, see [WEB_APP_IMPLEMENTATION.md](./WEB_APP_IMPLEMENTATION.md#pwa-implementation)

### 4. Database Architecture

Database System: MySQL with connection pooling for performance and reliability.

> For complete database schema, connection management, and implementation details, see [TECH_STACK.md](./TECH_STACK.md#database--data-storage)

## Security Architecture

### 1. Content Security Policy

Security Headers: Comprehensive HTTP security headers for protection against common vulnerabilities.

> For complete security header configuration, see [TECH_STACK.md](./TECH_STACK.md#security-headers)

### 2. Data Protection
- Input validation using TypeScript types
- SQL injection prevention through parameterized queries
- XSS protection with content sanitization
- HTTPS enforcement in production
- Environment variable protection

### 3. Authentication & Authorization
- JWT-based admin authentication
- Role-based access control (admin, moderator)
- IP-based rate limiting
- Session management
- Secure password hashing

## Performance Architecture

### 1. Caching Strategy
```
Level 1: Browser Cache (Static Assets)
Level 2: CDN Cache (Vercel Edge Network)
Level 3: Application Cache (Next.js ISR)
Level 4: Database Connection Pool
Level 5: Service Worker Cache (PWA)
```

### 2. Image Optimization
- Next.js Image component with automatic WebP conversion
- Responsive image generation
- Lazy loading implementation
- Critical resource preloading

### 3. Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting
- Bundle size optimization
- Tree shaking for unused code

## SEO Architecture

### 1. Structured Data System
```typescript
// Schema.org implementations
- OrganizationSchema     # Company information
- LocalBusinessSchema    # Local business data
- WebSiteSchema         # Site-wide schema
- BlogPostSchema        # Blog post markup
- FAQSchema            # Frequently asked questions
- VideoSchema          # Virtual tour videos
- ReviewSchema         # Customer testimonials
```

### 2. Content Optimization
- Automatic sitemap generation
- RSS feed for blog content
- Meta tag optimization
- Open Graph integration
- Twitter Card support
- Canonical URL management

## Integration Architecture

### 1. Third-Party Services
```
Google Sheets API ──► Lead Management
Google Analytics ──► Traffic Analysis
YouTube API ──────► Video Integration
WhatsApp Business ──► Customer Communication
```

### 2. API Design
- RESTful API endpoints
- Error handling middleware
- Rate limiting implementation
- Response caching
- CORS configuration

## Development Architecture

### 1. Build System
```bash
# Build pipeline
TypeScript Check → ESLint → TinaCMS Build → Next.js Build → Deployment
```

### 2. Development Workflow
> For complete development workflow, CI/CD pipeline, and deployment automation details, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Scalability Considerations

### 1. Performance Scaling
- Static site generation for high performance
- CDN distribution for global reach
- Database connection pooling
- Efficient caching strategies

### 2. Content Scaling
- Git-based content versioning
- Incremental static regeneration
- Modular component architecture
- Automated content optimization

### 3. Infrastructure Scaling
- Serverless deployment model
- Auto-scaling with Vercel
- Database optimization
- Asset optimization pipeline

## Monitoring & Analytics

### 1. Performance Monitoring
- Core Web Vitals tracking
- Real User Monitoring (RUM)
- Build performance metrics
- Database query optimization

### 2. Business Analytics
- Google Analytics 4 integration
- Conversion tracking
- User behavior analysis
- Content performance metrics

## Future Architecture Considerations

### 1. Potential Enhancements
- Multi-language support (i18n)
- Advanced personalization
- Real-time chat integration
- Enhanced offline capabilities

### 2. Migration Paths
- Database scaling options
- CDN optimization
- Enhanced security measures
- Advanced analytics integration