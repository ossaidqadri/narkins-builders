// src/components/schema/HillCrestResidencySchema.tsx
import Head from "next/head"

export const HillCrestResidencySchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: "Hill Crest Residency - Luxury Apartments in Bahria Town Karachi",
    description:
      "Luxurious 2, 3, and 4-bedroom apartments in Bahria Town Karachi with panoramic views and premium amenities by Narkin's Builders.",
    url: "https://www.narkinsbuilders.com/hill-crest-residency",
    image: [
      "https://www.narkinsbuilders.com/media/hcr/exterior/hill-crest-residency-exterior-view-bahria-town-karachi.webp",
      "https://www.narkinsbuilders.com/media/hcr/apartment-interiors/hill-crest-residency-apartment-interior-living-room-luxury.webp",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "29-30A Jinnah Avenue, Bahria Town",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      postalCode: "75340",
      addressCountry: "PK",
    },
    numberOfRooms: "2-4 bedrooms",
    floorSize: {
      "@type": "QuantitativeValue",
      value: "1400-2200",
      unitCode: "SQF",
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Panoramic Views",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Premium Finishes",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Modern Kitchen",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Parking",
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
