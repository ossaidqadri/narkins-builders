import Head from "next/head"

export const WebSiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Narkin's Builders",
    alternateName: "Narkins Builders",
    url: "https://www.narkinsbuilders.com",
    description:
      "Premium real estate developer in Bahria Town Karachi specializing in luxury apartments and residential projects with over 30 years of experience.",
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "Narkin's Builders and Developers",
      url: "https://www.narkinsbuilders.com",
      logo: "https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo-30-years-experience.webp",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://www.narkinsbuilders.com/blog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "Organization",
      name: "Narkin's Builders and Developers",
      url: "https://www.narkinsbuilders.com",
    },
    about: [
      {
        "@type": "Thing",
        name: "Real Estate Development",
      },
      {
        "@type": "Thing",
        name: "Luxury Apartments",
      },
      {
        "@type": "Thing",
        name: "Bahria Town Karachi",
      },
      {
        "@type": "Thing",
        name: "Property Investment",
      },
    ],
    keywords:
      "Narkin's Builders, Bahria Town Karachi, luxury apartments, real estate developer, Hill Crest Residency, Narkin's Boutique Residency",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@type": "Organization",
      name: "Narkin's Builders and Developers",
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
