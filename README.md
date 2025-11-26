# Narkins Builders

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green?style=flat-square)](https://web.dev/progressive-web-apps/)
[![TinaCMS](https://img.shields.io/badge/TinaCMS-Enabled-orange?style=flat-square)](https://tina.io/)

A modern real estate platform built with Next.js 15, TinaCMS, and TypeScript. Features Progressive Web App capabilities, integrated CRM, and advanced content management.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance](#performance)
- [Security](#security)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

This application follows a modern full-stack architecture with the following layers:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Layer  │    │  Service Layer  │    │   Data Layer    │
│                 │    │                 │    │                 │
│ • Next.js App   │◄──►│ • TinaCMS       │◄──►│ • MySQL DB      │
│ • PWA Features  │    │ • Google Sheets │    │ • File System   │
│ • Service Worker│    │ • Analytics     │    │ • External APIs │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Design Patterns Used

- Server-Side Rendering (SSR): Next.js App Router for optimal SEO and performance
- Static Site Generation (SSG): Pre-built pages with ISR for dynamic content
- Full-Stack API: Next.js API routes with database integration
- Component Composition: Modular React components with TypeScript
- State Management: Zustand for global state, React hooks for local state
- Headless CMS: TinaCMS with database-backed content management
- Progressive Enhancement: Core functionality works without JavaScript

## Tech Stack

### Frontend
- Framework: Next.js 15 (App Router)
- Language: TypeScript 5.4.5
- Styling: Tailwind CSS + shadcn/ui
- Animation: Framer Motion
- State: Zustand + React hooks

### Backend & Services
- Runtime: Bun (recommended) / Node.js
- CMS: TinaCMS with Git workflow
- Database: MySQL2
- Authentication: JWT + bcryptjs
- Forms: Google Sheets API integration

### Infrastructure
- PWA: Service Worker + Web App Manifest
- Analytics: Google Analytics 4
- SEO: Schema.org structured data
- Build: Turbopack (dev) / Webpack (prod)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                   # Utility functions
│   ├── utils.ts          # General utilities
│   ├── db.ts             # Database connection
│   └── validations.ts    # Zod schemas
├── public/               # Static assets
│   ├── icons/           # PWA icons
│   └── images/          # Image assets
├── content/             # TinaCMS content
│   ├── posts/          # Blog posts
│   └── pages/          # Static pages
├── tina/               # TinaCMS configuration
│   ├── config.ts       # Schema definitions
│   └── database.ts     # Database adapter
└── types/              # TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- MySQL database (optional)
- Google Sheets API credentials (for CRM)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/narkins-builders.git
   cd narkins-builders
   ```

2. Install dependencies
   ```bash
   bun install
   # or
   npm install
   ```

3. Environment setup
   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables
   ```env
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_GA_ID=your-ga-id

   # TinaCMS
   NEXT_PUBLIC_TINA_CLIENT_ID=your_tina_client_id
   TINA_TOKEN=your_tina_token

   # Database (optional)
   DATABASE_URL=mysql://user:password@localhost:3306/narkins

   # Google Sheets CRM
   GOOGLE_SHEETS_CREDENTIALS=your-service-account-json
   GOOGLE_SHEET_ID=your-sheet-id
   ```

5. Start development server
   ```bash
   bun run dev
   ```

6. Access the application
   - Website: http://localhost:3000
   - CMS Admin: http://localhost:3000/admin

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server with turbopack |
| `bun build` | Build for production |
| `bun build:full` | Full build with type checking and linting |
| `bun start` | Start production server |
| `bun typecheck` | Run TypeScript compiler |
| `bun lint` | Run ESLint |
| `bun check` | Run both typecheck and lint |

### Development Workflow

1. Feature Development
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature
   
   # Start development
   bun run dev
   
   # Make changes and test
   bun run check
   
   # Commit changes
   git commit -m "feat: add your feature"
   ```

2. Content Management
   - Access TinaCMS admin at `/admin`
   - Create/edit content through the visual editor
   - Changes are committed to Git automatically

3. Database Migrations
   ```bash
   # Run migrations (if using database)
   bun run db:migrate
   
   # Seed development data
   bun run db:seed
   ```

## API Documentation

### Authentication

```typescript
// JWT Authentication
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Response
{
  "token": "jwt-token",
  "user": { "id": 1, "email": "user@example.com" }
}
```

### Contact Forms

```typescript
// Submit contact form
POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+92-300-1234567",
  "property": "hill-crest-residency",
  "message": "Interested in 3BR apartment"
}

// Response
{
  "success": true,
  "id": "sheet-row-id"
}
```

### Property Endpoints

```typescript
// Get all properties
GET /api/properties

// Get single property
GET /api/properties/[slug]

// Property interest form
POST /api/properties/[slug]/interest
```

## Database Schema

### Core Tables

```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries table
CREATE TABLE inquiries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  property_slug VARCHAR(100),
  message TEXT,
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_type VARCHAR(50) NOT NULL,
  page_url VARCHAR(500),
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Test Structure

```
├── __tests__/
│   ├── components/        # Component tests
│   ├── pages/            # Page tests
│   └── api/              # API tests
├── e2e/                  # End-to-end tests
└── __mocks__/            # Test mocks
```

### Running Tests

```bash
# Unit tests
bun test

# E2E tests
bun run test:e2e

# Coverage report
bun run test:coverage
```

### Test Examples

```typescript
// Component test
import { render, screen } from '@testing-library/react'
import { ContactForm } from '@/components/forms/ContactForm'

test('renders contact form', () => {
  render(<ContactForm />)
  expect(screen.getByRole('form')).toBeInTheDocument()
})

// API test
import { POST } from '@/app/api/contact/route'

test('handles contact form submission', async () => {
  const request = new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    body: JSON.stringify({ name: 'Test', email: 'test@example.com' })
  })
  
  const response = await POST(request)
  expect(response.status).toBe(200)
})
```

## Deployment

### Build Process

```bash
# Production build
bun run build:full

# Verify build
bun run start
```

### Platform Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Build command
bun run build

# Publish directory
out/
```

### Environment Variables

Set these in your deployment platform:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# TinaCMS
NEXT_PUBLIC_TINA_CLIENT_ID=xxx
TINA_TOKEN=xxx

# Optional
DATABASE_URL=xxx
GOOGLE_SHEETS_CREDENTIALS=xxx
```

## Performance

### Core Web Vitals Targets

- LCP: < 2.5s
- FID: < 100ms  
- CLS: < 0.1

### Optimization Techniques

- Image Optimization: Next.js Image component with WebP
- Code Splitting: Dynamic imports for heavy components
- Caching: ISR for static content, SWR for client data
- Bundle Analysis: Analyze bundle size with `@next/bundle-analyzer`

### Monitoring

```bash
# Lighthouse CI
bun run lighthouse

# Bundle analysis
bun run analyze
```

## Security

### Implemented Measures

- Content Security Policy: Configured in `next.config.js`
- HTTPS Only: Enforced in production
- Input Validation: Zod schemas for all forms
- Rate Limiting: API route protection
- Authentication: JWT with secure httpOnly cookies

### Security Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
  // ... more headers
]
```

## Contributing

### Code Standards

- TypeScript: Strict mode enabled
- ESLint: Extended from Next.js config
- Prettier: Configured for consistent formatting
- Commit Convention: Conventional commits

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes following code standards
4. Run tests: `bun run check`
5. Commit changes: `git commit -m 'feat: add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open Pull Request

### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

## Troubleshooting

### Common Issues

#### TinaCMS Build Errors

```bash
# Clear Tina cache
rm -rf .tina/__generated__

# Rebuild schema
bun run tina:build
```

#### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules bun.lockb
bun install
```

#### Database Connection Issues

```bash
# Test database connection
bun run db:test

# Check environment variables
echo $DATABASE_URL
```

### Performance Issues

- Check bundle size: `bun run analyze`
- Review Core Web Vitals in DevTools
- Enable Next.js speed insights

### Getting Help

- Check existing [GitHub Issues](https://github.com/your-username/narkins-builders/issues)
- Create new issue with reproduction steps
- Join our [Discord community](#)

## Credits

Developed by: [The Other Dev](https://otherdev.com)  
Contact: hello@otherdev.com  
LinkedIn: [The Other Dev](https://www.linkedin.com/company/theotherdev)

## License

© 2025 Narkin's Builders. All rights reserved.