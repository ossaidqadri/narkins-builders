// src/types.d.ts
declare global {
  interface Window {
    safari: any
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export {}
