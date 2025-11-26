import Head from "next/head"

interface BlogPostSchemaProps {
  title: string
  excerpt: string
  date: string
  image: string
  url: string
}

export const BlogPostSchema: React.FC<BlogPostSchemaProps> = ({
  title,
  excerpt,
  date,
  image,
  url,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: date,
    image: image, // ✅ FIXED: was "https://www.narkinsbuilders.com"
    url: url, // ✅ FIXED: was "https://www.narkinsbuilders.com"
    author: {
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
