// src/components/schema/ReviewSchema.tsx
import Head from "next/head"

export const ReviewSchema = () => (
  <Head>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Narkin's Builders and Developers",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "47",
            bestRating: "5",
            worstRating: "1",
          },
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
              datePublished: "2024-05-15",
            },
            {
              "@type": "Review",
              author: {
                "@type": "Person",
                name: "Saad Arshad",
              },
              reviewBody:
                "Excellent quality construction and timely delivery. Very professional team.",
              reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
                bestRating: "5",
                worstRating: "1",
              },
              datePublished: "2024-04-20",
            },
            {
              "@type": "Review",
              author: {
                "@type": "Person",
                name: "Arsalan",
              },
              reviewBody:
                "Smooth booking experience, very transparent throughout the process.",
              reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
                bestRating: "5",
                worstRating: "1",
              },
              datePublished: "2024-03-25",
            },
            {
              "@type": "Review",
              author: {
                "@type": "Person",
                name: "Umair Iqrar",
              },
              reviewBody:
                "I decided to invest during the initial launch phase, and after just two years, I've seen substantial returns. It's been a fantastic investment opportunity!",
              reviewRating: {
                "@type": "Rating",
                ratingValue: "4",
                bestRating: "5",
                worstRating: "1",
              },
              datePublished: "2024-02-10",
            },
          ],
        }),
      }}
    />
  </Head>
)
