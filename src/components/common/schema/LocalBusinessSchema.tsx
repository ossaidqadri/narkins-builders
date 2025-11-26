// src/components/schema/LocalBusinessSchema.tsx
import Head from "next/head"

export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    name: "Narkin's Builders and Developers",
    alternateName: "Narkins Builders",
    url: "https://www.narkinsbuilders.com",
    image:
      "https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo-30-years-experience.webp",
    logo: {
      "@type": "ImageObject",
      url: "https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo-30-years-experience.webp",
      width: 400,
      height: 400,
    },
    description:
      "Leading real estate developer in Karachi specializing in luxury apartments and residential projects in Bahria Town since 1994. Over 30 years of experience in premium residential construction.",
    slogan: "Creating Iconic Living Experiences",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bahria Town Karachi",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      postalCode: "75340",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.8893,
      longitude: 67.1872,
    },
    telephone: "+92-320-324-3970",
    foundingDate: "1994",
    priceRange: "PKR 25,000,000 - PKR 80,000,000",
    areaServed: [
      {
        "@type": "Place",
        name: "Bahria Town Karachi",
      },
      {
        "@type": "Place",
        name: "Karachi, Pakistan",
      },
    ],
    serviceType: [
      "Real Estate Development",
      "Luxury Apartment Construction",
      "Property Investment",
    ],
    knowsAbout: [
      "Luxury Apartments",
      "Residential Construction",
      "Property Development",
      "Bahria Town Projects",
      "Investment Opportunities",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+92-320-324-3970",
        contactType: "sales",
        availableLanguage: ["English", "Urdu"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
      },
    ],
    sameAs: [
      "https://www.facebook.com/narkinsbuilders",
      "https://www.instagram.com/narkinsbuilders",
      "https://www.linkedin.com/company/narkins-builders-and-developers",
      "https://youtu.be/tT7kkMM0pz0",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Luxury Apartment Projects",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Hill Crest Residency",
            description:
              "2, 3 & 4 bedroom luxury apartments in Bahria Town Karachi",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Narkin's Boutique Residency",
            description:
              "Premium residential apartments with world-class amenities",
          },
        },
      ],
    },
    award: "30 Years of Excellence in Real Estate Development",
    isicV4: "4100",
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
