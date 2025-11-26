# Technology Stack Documentation

## Overview

Narkins Builders utilizes a modern, performance-optimized technology stack designed for scalability, maintainability, and exceptional user experience in the real estate sector.

## Core Technologies

### Frontend Framework
Next.js 15.3.5
- App Router: Modern routing system with layout support
- Server-Side Rendering (SSR): Optimal SEO and performance
- Static Site Generation (SSG): Pre-built pages for speed
- Incremental Static Regeneration (ISR): Dynamic content with static performance
- Turbopack: Ultra-fast bundler for development builds

Key Features:
```javascript
// next.config.js highlights
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd', '@ant-design/plots'],
  images: {
    remotePatterns: [/* YouTube, domain patterns */]
  }
}
```

### UI Framework & Styling
React 18.3.1
- Concurrent Features: Improved rendering performance
- Server Components: Reduced bundle size
- Hooks API: Modern state management patterns

Tailwind CSS 3.4.3
```typescript
// tailwind.config.ts
const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
      }
    }
  }
}
```

Component Libraries:
- shadcn/ui: Modern, accessible component system
- Radix UI: Unstyled, accessible primitives 
- Ant Design: Enterprise-class UI components
- Heroicons: Beautiful hand-crafted SVG icons
- Lucide React: Feature-rich icon library

### State Management
Zustand 5.0.6
```typescript
// Global state management
import { create } from 'zustand'

interface AppState {
  // State definitions
  user: User | null
  theme: 'light' | 'dark'
  // Actions
  setUser: (user: User) => void
  toggleTheme: () => void
}

const useAppStore = create<AppState>((set) => ({
  user: null,
  theme: 'light',
  setUser: (user) => set({ user }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}))
```

Local State Management:
- React Hooks: useState, useEffect, useContext
- Custom Hooks: Reusable state logic
- Context API: Component tree state sharing

## Language & Type Safety

### TypeScript 5.4.5
```json
// tsconfig.json configuration
{
  "compilerOptions": {
    "target": "es5",
    "strict": false,
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Type Safety Features:
- Interface Definitions: Strong typing for data structures
- Generic Components: Reusable typed components
- API Response Types: Type-safe server communication
- Props Validation: Component interface enforcement

## Content Management

### TinaCMS 2.8.1
Headless CMS Features:
- Git-based Workflow: Version controlled content
- Visual Editor: WYSIWYG editing experience
- Schema-driven: Type-safe content modeling
- Real-time Preview: Live content editing

```typescript
// tina/config.ts
export default defineConfig({
  branch: 'main',
  schema: {
    collections: [
      {
        name: 'blog',
        path: 'content/blogs',
        format: 'mdx',
        fields: [/* Schema definitions */]
      }
    ]
  }
});
```

### MDX Processing
@next/mdx with Remark/Rehype:
- MDX Compilation: JSX in Markdown
- Syntax Highlighting: Code block styling
- Custom Components: React components in content
- Static Analysis: Build-time processing

## Database & Data Storage

### MySQL 2 (3.14.2)
```typescript
// Database connection with pooling
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
};

// Connection pool for performance
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

Database Schema:
- blog_comments: User comments with moderation
- comment_likes: User engagement tracking  
- blog_stats: Content performance metrics
- admin_users: Administrative access control
- moderation_log: Content moderation history

### File Storage
Git-based Content Storage:
- Content: Markdown/MDX files in repository
- Media: Public folder with CDN optimization
- Configuration: Environment-based settings
- Versioning: Full Git history for all content

## Authentication & Security

### JWT Authentication
```typescript
// JWT implementation
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Password hashing
const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

// Token generation
const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};
```

Security Libraries:
- bcryptjs 3.0.2: Password hashing
- jsonwebtoken 9.0.2: JWT token management
- DOMPurify 3.2.6: XSS protection for user content

### Security Headers
```javascript
// next.config.js security configuration
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  }
];
```

## Progressive Web App (PWA)

PWA Stack: Workbox 7.3.0 with intelligent caching, offline functionality, and native app features.

> For complete PWA implementation, service worker configuration, and installation components, see [WEB_APP_IMPLEMENTATION.md](./WEB_APP_IMPLEMENTATION.md#pwa-implementation)

## Performance Optimization

### Image Optimization
Next.js Image Component:
- Automatic WebP: Modern format conversion
- Responsive Images: Multiple sizes generation
- Lazy Loading: Viewport-based loading
- Priority Loading: Critical image preloading

```tsx
import Image from 'next/image'

<Image
  src="/images/property-image.webp"
  alt="Property Description"
  width={800}
  height={600}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Bundle Optimization
Code Splitting Strategies:
- Route-based Splitting: Automatic by Next.js
- Component-level Splitting: Dynamic imports
- Library Splitting: Vendor chunk optimization
- Tree Shaking: Dead code elimination

```typescript
// Dynamic component loading
const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { 
    loading: () => <ComponentSkeleton />,
    ssr: false 
  }
);
```

## Animation & UI Enhancement

### Framer Motion 12.23.3
```tsx
import { motion } from 'framer-motion'

const AnimatedComponent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    Content with smooth animations
  </motion.div>
);
```

Animation Features:
- Page Transitions: Smooth route changes
- Scroll Animations: Viewport-triggered effects
- Gesture Handling: Touch and mouse interactions
- Layout Animations: Automatic layout transitions

### Carousel Implementation
Embla Carousel React 8.6.0:
- Touch Support: Mobile-optimized navigation
- Infinite Loop: Seamless content cycling
- Auto-play: Time-based advancement
- Responsive Design: Breakpoint-aware layouts

## Third-Party Integrations

### Google Services
Google APIs 152.0.0
```typescript
// Google Sheets integration
import { google } from 'googleapis';

const sheets = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_SHEETS_API_KEY
});

// Lead data submission
await sheets.spreadsheets.values.append({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: 'Leads!A:E',
  valueInputOption: 'RAW',
  requestBody: {
    values: [leadData]
  }
});
```

Analytics Integration:
- Google Analytics 4: User behavior tracking
- Core Web Vitals: Performance monitoring
- Conversion Tracking: Goal measurement
- Custom Events: Business metric tracking

### Communication Tools
WhatsApp Business Integration:
- Direct Messaging: Customer communication
- Template Messages: Automated responses
- Broadcast Lists: Marketing campaigns
- Business Profile: Professional presence

## Development Tools

### Package Management
Bun Runtime:
- Ultra-fast Installation: Optimized dependency management
- Built-in Bundler: Development and production builds
- TypeScript Support: Native TypeScript execution
- Hot Reloading: Instant development feedback

```json
// package.json scripts
{
  "scripts": {
    "dev": "tinacms dev -c \"next dev --turbopack\"",
    "build": "tinacms build && next build",
    "typecheck": "bunx tsc --noEmit --incremental",
    "lint": "next lint",
    "check": "bunx tsc --noEmit && next lint"
  }
}
```

### Code Quality Tools
ESLint 9.1.0 with Next.js Config:
- Code Standards: Consistent formatting rules
- Error Detection: Potential bug identification
- Best Practices: Framework-specific optimizations
- Auto-fixing: Automated code corrections

Pre-commit Hooks:
- lint-staged: Process only staged files
- TypeScript Check: Type validation
- Prettier Formatting: Code beautification
- ESLint Auto-fix: Rule compliance

## Build & Deployment

### Build Pipeline
```bash
# Production build process
TypeScript Check → ESLint Validation → TinaCMS Build → Next.js Build → Vercel Deploy
```

Build Optimization:
- Parallel Processing: Concurrent task execution
- Incremental Builds: Only rebuild changed components
- Asset Optimization: Image, CSS, and JS minification
- Bundle Analysis: Size monitoring and optimization

### Deployment Platform
Vercel Integration:
```json
// vercel.json
{
  "buildCommand": "bun run build:vercel",
  "framework": "nextjs",
  "functions": {
    "src/pages/api/sitemap.xml.ts": {
      "maxDuration": 30
    }
  }
}
```

Deployment Features:
- Edge Network: Global CDN distribution
- Serverless Functions: Scalable API endpoints
- Preview Deployments: Branch-based staging
- Analytics: Built-in performance monitoring

## Monitoring & Analytics

### Performance Monitoring
Core Web Vitals Tracking:
- Largest Contentful Paint (LCP): Loading performance
- First Input Delay (FID): Interactivity measurement
- Cumulative Layout Shift (CLS): Visual stability

Custom Metrics:
```typescript
// Performance measurement
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking
Built-in Error Boundaries:
- Component Error Isolation: Prevent app crashes
- Error Reporting: Automatic error logging
- Fallback UI: Graceful degradation
- Recovery Mechanisms: Error state handling

## Environment Configuration

Environment Management: The application uses environment variables for configuration across development, staging, and production environments.

> For complete environment variable configuration and examples, see [DEPLOYMENT.md](./DEPLOYMENT.md#environment-management)

## Future Technology Considerations

### Planned Upgrades
1. React Server Components: Enhanced performance
2. Edge Runtime: Faster API responses
3. Streaming SSR: Improved loading experience
4. Web Streams API: Better data handling
5. Module Federation: Micro-frontend architecture

### Technology Evaluation
- Database Migration: PostgreSQL consideration
- CDN Enhancement: Multi-provider setup
- Real-time Features: WebSocket integration
- Mobile App: React Native development
- Internationalization: Multi-language support