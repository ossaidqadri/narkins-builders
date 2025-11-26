// lib/gtag.ts - Enhanced with debugging
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID as string

// Debug function to check GA status
export const checkGAStatus = () => {}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
type GtagEvent = {
  action: string
  category: string
  label?: string
  value?: number
}

export const event = ({ action, category, label, value }: GtagEvent) => {
  // Always log for debugging

  if (typeof window === "undefined") {
    return
  }

  if (!GA_TRACKING_ID) {
    console.error("ERROR: No Google Analytics ID found")
    return
  }

  if (!window.gtag) {
    console.error("ERROR: gtag function not available")
    checkGAStatus()
    return
  }

  // Send the event
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Real Estate Specific Events
export const trackPropertyView = (
  propertyName: string,
  propertyType: string
) => {
  event({
    action: "view_property",
    category: "Real Estate",
    label: `${propertyName} - ${propertyType}`,
  })
}

export const trackFormSubmission = (
  formType: "contact" | "quote" | "newsletter",
  propertyInterest?: string
) => {
  event({
    action: "form_submit",
    category: "Lead Generation",
    label: propertyInterest ? `${formType} - ${propertyInterest}` : formType,
  })
}

export const trackWhatsAppClick = (source: string) => {
  event({
    action: "whatsapp_click",
    category: "Contact",
    label: source,
  })
}

export const trackPropertyComparison = (properties: string[]) => {
  event({
    action: "compare_properties",
    category: "Real Estate",
    label: properties.join(" vs "),
  })
}

export const trackDownload = (fileName: string, fileType: string) => {
  event({
    action: "download",
    category: "Content",
    label: `${fileName} - ${fileType}`,
  })
}

export const trackVideoPlay = (
  videoTitle: string,
  videoType: "property_tour" | "testimonial" | "amenity"
) => {
  event({
    action: "video_play",
    category: "Engagement",
    label: `${videoTitle} - ${videoType}`,
  })
}

export const trackCallToAction = (ctaText: string, location: string) => {
  event({
    action: "cta_click",
    category: "Engagement",
    label: `${ctaText} - ${location}`,
  })
}
