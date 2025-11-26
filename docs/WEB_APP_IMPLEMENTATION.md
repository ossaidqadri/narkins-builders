# Web App Implementation Guide

## Overview

This document provides comprehensive guidance for implementing features and components in the Narkins Builders web application, following established patterns and best practices.

## Project Structure

### Directory Organization
```
src/
├── components/
│   ├── common/          # Shared utilities and base components
│   │   ├── schema/      # SEO structured data components
│   │   ├── seo-image/   # Dynamic SEO image generation
│   │   ├── typography/  # Text and typography components
│   │   └── ui/          # Base UI components (shadcn/ui)
│   ├── features/        # Business-specific components
│   │   ├── blog/        # Blog functionality
│   │   ├── lead-form/   # Lead generation forms
│   │   ├── pwa-install/ # PWA installation prompts
│   │   └── video-player/# Custom video players
│   └── layout/          # Layout components
│       ├── footer/      # Site footer
│       └── navigation/  # Main navigation
├── lib/                 # Utility functions and configurations
├── pages/              # Next.js pages (Pages Router)
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── data/               # Static data and configurations
├── styles/             # Global styles and CSS
└── types/              # TypeScript type definitions
```

## Component Development

### 1. Component Structure Standards

Base Component Template:
```tsx
// src/components/features/example/example-component.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ExampleComponentProps {
  title: string;
  description?: string;
  variant?: 'default' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  description,
  variant = 'default',
  className,
  children,
}) => {
  return (
    <div className={cn(
      'base-styles',
      variant === 'secondary' && 'secondary-styles',
      className
    )}>
      <h2 className="text-xl font-bold">{title}</h2>
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
      {children}
    </div>
  );
};

export default ExampleComponent;
```

### 2. Styling Conventions

Tailwind CSS Patterns:
```tsx
// Component with responsive design
<div className={cn(
  // Base styles
  'flex flex-col items-center justify-center',
  'p-6 rounded-lg shadow-md',
  
  // Responsive styles
  'sm:flex-row sm:p-8',
  'md:p-12',
  'lg:max-w-6xl lg:mx-auto',
  
  // Conditional styles
  isActive && 'bg-primary text-primary-foreground',
  variant === 'outline' && 'border border-border',
  
  // External className
  className
)}>
```

Custom CSS Variables:
```css
/* src/styles/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}
```

### 3. State Management Patterns

Local State with Hooks:
```tsx
import { useState, useEffect } from 'react';

const ComponentWithState = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <DataDisplay data={data} />;
};
```

Global State with Zustand:
```tsx
// src/zustand/store.ts
import { create } from 'zustand';

interface AppStore {
  user: User | null;
  theme: 'light' | 'dark';
  isMenuOpen: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  toggleMenu: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  theme: 'light',
  isMenuOpen: false,
  
  setUser: (user) => set({ user }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  toggleMenu: () => set((state) => ({ 
    isMenuOpen: !state.isMenuOpen 
  })),
}));

// Usage in component
const SomeComponent = () => {
  const { user, setUser, theme, toggleTheme } = useAppStore();
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {/* Component content */}
    </div>
  );
};
```

## Form Implementation

### 1. Lead Generation Forms

Contact Form Example:
```tsx
// src/components/features/lead-form/contact-form.tsx
import { useState } from 'react';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  property: string;
  message: string;
}

export const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    property: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '', email: '', phone: '', property: '', message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </Button>
      
      {submitStatus === 'success' && (
        <p className="text-green-600">Thank you! We'll contact you soon.</p>
      )}
      {submitStatus === 'error' && (
        <p className="text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
};
```

### 2. Form Validation

Input Validation Utilities:
```tsx
// src/lib/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Form validation hook
export const useFormValidation = (formData: ContactFormData) => {
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validate };
};
```

## API Implementation

### 1. API Routes Structure

Google Sheets API Integration:
```tsx
// src/pages/api/sheets.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  property: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, property, message }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare data for Google Sheets
    const rowData = [
      new Date().toISOString(),
      name,
      email,
      phone,
      property || 'General Inquiry',
      message || '',
      req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown',
      req.headers['user-agent'] || 'Unknown'
    ];

    // Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Leads!A:H',
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData],
      },
    });

    res.status(200).json({ 
      success: true, 
      message: 'Lead submitted successfully' 
    });
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    res.status(500).json({ 
      error: 'Failed to submit lead' 
    });
  }
}
```

### 2. Database Operations

Database Layer: Utilizes the MySQL connection pool and query utilities from the main database layer.

> For complete database configuration, schema, and connection management, see [TECH_STACK.md](./TECH_STACK.md#database--data-storage)

Example API Implementation:
```tsx
// Example: Using the database layer in API routes
import { CommentQueries } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const comments = await CommentQueries.getCommentsBySlug(slug as string);
  res.json({ comments });
}
```

## Component Integration Patterns

### 1. SEO Components

Structured Data Implementation:
```tsx
// src/components/common/schema/local-business-schema.tsx
import { LocalBusinessSchema as Schema } from '@/types/schema';

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  phone: string;
  email: string;
  url: string;
  openingHours: string[];
}

export const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({
  name,
  description,
  address,
  phone,
  email,
  url,
  openingHours,
}) => {
  const schema: Schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "telephone": phone,
    "email": email,
    "url": url,
    "openingHoursSpecification": openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.split(' ')[0],
      "opens": hours.split(' ')[1],
      "closes": hours.split(' ')[2]
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

### 2. Media Components

Custom Video Player:
```tsx
// src/components/features/video-player/video-player.tsx
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  autoplay = false,
  muted = false,
  controls = true,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  return (
    <div className={cn('relative group', className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoplay}
        muted={muted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-auto"
        aria-label={title}
      />
      
      {controls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button
              onClick={toggleMute}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <div className="flex-1 bg-gray-600 h-1 rounded">
              <div 
                className="bg-white h-full rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

## PWA Implementation

### 1. Service Worker Integration

PWA Installation Component:
```tsx
// src/components/features/pwa-install/pwa-install.tsx
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/common/ui/button';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || localStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="max-w-md mx-auto flex items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Install Narkin's Builders</h3>
          <p className="text-xs text-gray-600">
            Get quick access to property updates and notifications.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleInstall}
            size="sm"
            className="flex items-center gap-1"
          >
            <Download size={16} />
            Install
          </Button>
          
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
```

### 2. Offline Support

Service Worker Registration:
```tsx
// src/lib/pwa.ts
export const registerServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered: ', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
                showUpdateNotification();
              }
            });
          }
        });
      } catch (error) {
        console.log('SW registration failed: ', error);
      }
    });
  }
};

const showUpdateNotification = () => {
  // Show notification to user about app update
  if (confirm('New version available! Reload to update?')) {
    window.location.reload();
  }
};
```

## Performance Optimization

### 1. Image Optimization

Next.js Image Component Usage:
```tsx
import Image from 'next/image';

const OptimizedImage = ({ src, alt, priority = false }) => (
  <Image
    src={src}
    alt={alt}
    width={800}
    height={600}
    priority={priority}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover rounded-lg"
  />
);
```

### 2. Code Splitting

Dynamic Imports:
```tsx
import dynamic from 'next/dynamic';

// Component-level code splitting
const HeavyChart = dynamic(
  () => import('@/components/features/chart/heavy-chart'),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
);

// Conditional loading
const AdminPanel = dynamic(
  () => import('@/components/admin/admin-panel'),
  { 
    loading: () => <div>Loading admin panel...</div>,
    ssr: false 
  }
);

export const Dashboard = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  
  return (
    <div>
      <HeavyChart data={chartData} />
      {showAdmin && <AdminPanel />}
    </div>
  );
};
```

## Testing Implementation

### 1. Component Testing

Jest and React Testing Library:
```tsx
// src/components/features/contact-form/__tests__/contact-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from '../contact-form';

// Mock API call
jest.mock('@/lib/api', () => ({
  submitContactForm: jest.fn(),
}));

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockSubmit = require('@/lib/api').submitContactForm;
    mockSubmit.mockResolvedValue({ success: true });
    
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '+1234567890' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        property: '',
        message: ''
      });
    });
  });
});
```

### 2. Integration Testing

API Route Testing:
```tsx
// src/pages/api/__tests__/sheets.test.ts
import handler from '../sheets';
import { createMocks } from 'node-mocks-http';

jest.mock('googleapis');

describe('/api/sheets', () => {
  it('handles POST request successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        property: 'Test Property',
        message: 'Test message'
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      message: 'Lead submitted successfully'
    });
  });

  it('validates required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: '',
        email: '',
        phone: ''
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Missing required fields'
    });
  });
});
```

## Deployment Considerations

### 1. Environment Configuration

Environment-Specific Settings:
```tsx
// src/lib/config.ts
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: 'Narkin\'s Builders',
  },
  
  api: {
    googleSheetsId: process.env.GOOGLE_SHEET_ID,
    tinaCmsClientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  },
  
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  },
};
```

### 2. Build Optimization

Next.js Configuration:
```javascript
// next.config.js production optimizations
const nextConfig = {
  // Enable SWC minification
  swcMinify: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression
  compress: true,
  
  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(new BundleAnalyzerPlugin());
      return config;
    },
  }),
};
```

This implementation guide provides the foundation for building scalable, maintainable features within the Narkins Builders web application while following established patterns and best practices.