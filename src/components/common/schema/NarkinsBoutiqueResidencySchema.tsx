// src/components/schema/NarkinsBoutiqueResidencySchema.tsx
import Head from "next/head"

export const NarkinsBoutiqueResidencySchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: "Narkin's Boutique Residency - Premium Apartments in Bahria Town Karachi",
    description:
      "Premium 2 and 3-bedroom apartments in Bahria Town Karachi with luxury amenities and modern design by Narkin's Builders.",
    url: "https://www.narkinsbuilders.com/narkins-boutique-residency",
    image: [
      "https://www.narkinsbuilders.com/media/nbr/exterior/narkins-boutique-residency-exterior-heritage-commercial-bahria-town.webp",
      "https://www.narkinsbuilders.com/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-living-room-luxury.webp",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bahria Town",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      postalCode: "75340",
      addressCountry: "PK",
    },
    numberOfRooms: "2-3 bedrooms",
    floorSize: {
      "@type": "QuantitativeValue",
      value: "1200-1800",
      unitCode: "SQF",
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Parking",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Security",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Elevator",
        value: true,
      },
    ],
    containedInPlace: {
      "@type": "Place",
      name: "Bahria Town Karachi",
    },
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
