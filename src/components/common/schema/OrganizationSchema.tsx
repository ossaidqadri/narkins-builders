// src/components/schema/OrganizationSchema.tsx
import Head from "next/head"

export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Narkin's Builders and Developers",
    url: "https://www.narkinsbuilders.com",
    logo: "https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo.webp",
    description:
      "Leading real estate developer in Karachi specializing in luxury apartments and residential projects in Bahria Town since 1994.",
    foundingDate: "1994",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bahria Town Karachi",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      postalCode: "75340",
      addressCountry: "PK",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+92-320-324-3970",
      contactType: "customer service",
      availableLanguage: ["English", "Urdu"],
    },
    sameAs: [
      "https://www.facebook.com/narkinsbuilders",
      "https://www.instagram.com/narkinsbuilders",
    ],
    areaServed: "Bahria Town Karachi",
    serviceType: "Real Estate Development",
    knowsAbout: [
      "Luxury Apartments",
      "Residential Construction",
      "Property Development",
      "Bahria Town Projects",
    ],
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}
