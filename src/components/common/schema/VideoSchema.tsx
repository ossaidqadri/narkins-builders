import Head from "next/head"

interface VideoSchemaProps {
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string // ISO 8601 format (e.g., "PT2M30S" for 2 minutes 30 seconds)
  pageUrl: string
}

export const VideoSchema = ({
  title,
  description,
  videoUrl,
  thumbnailUrl,
  uploadDate,
  duration = "PT3M",
  pageUrl,
}: VideoSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description: description,
    contentUrl: videoUrl,
    embedUrl: videoUrl,
    thumbnailUrl: thumbnailUrl,
    uploadDate: uploadDate,
    duration: duration,
    publisher: {
      "@type": "Organization",
      name: "Narkin's Builders and Developers",
      url: "https://www.narkinsbuilders.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo-30-years-experience.webp",
        width: 400,
        height: 400,
      },
    },
    creator: {
      "@type": "Organization",
      name: "Narkin's Builders and Developers",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    potentialAction: {
      "@type": "WatchAction",
      target: videoUrl,
    },
    inLanguage: "en-US",
    isFamilyFriendly: true,
    genre: "Real Estate",
    keywords:
      "Narkin's Builders, Bahria Town Karachi, luxury apartments, virtual tour, property showcase",
    about: [
      {
        "@type": "Thing",
        name: "Luxury Apartments",
      },
      {
        "@type": "Thing",
        name: "Real Estate Development",
      },
      {
        "@type": "Thing",
        name: "Bahria Town Karachi",
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
