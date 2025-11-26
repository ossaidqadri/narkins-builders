// src/components/schema/AboutPageSchema.tsx
import Head from "next/head"

export const AboutPageSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Narkin's Builders and Developers",
    url: "https://www.narkinsbuilders.com",
    logo: "https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo-30-years-experience.webp",
    description:
      "Leading real estate developer in Karachi specializing in luxury apartments and residential projects in Bahria Town since 1994. Over 30 years of construction excellence.",
    foundingDate: "1994",
    address: {
      "@type": "PostalAddress",
      streetAddress: "29-30A Jinnah Avenue, Bahria Town",
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
      hoursAvailable: "Mo-Sa 09:00-18:00",
    },
    sameAs: [
      "https://www.facebook.com/narkinsbuilders",
      "https://www.instagram.com/narkinsbuilders",
    ],
    areaServed: {
      "@type": "Place",
      name: "Bahria Town Karachi",
    },
    serviceType: "Real Estate Development",
    knowsAbout: [
      "Luxury Apartments",
      "Residential Construction",
      "Property Development",
      "Bahria Town Projects",
      "Real Estate Investment",
    ],
    numberOfEmployees: "50-100",
    award: [
      "30 Years Construction Excellence",
      "Trusted Real Estate Developer Bahria Town",
    ],
    // Add aggregate rating from reviews
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "47",
      bestRating: "5",
      worstRating: "1",
    },
    // Add some reviews for the organization
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Ahmed Hassan",
        },
        reviewBody:
          "Highly committed to delivering in timelines, I wholeheartedly recommend considering investment in projects by Narkin's Builders.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
          worstRating: "1",
        },
        datePublished: "2024-12-15",
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Saad Arshad",
        },
        reviewBody:
          "Excellent quality construction and timely delivery. Very professional team with 30 years of experience.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
          worstRating: "1",
        },
        datePublished: "2024-11-20",
      },
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
