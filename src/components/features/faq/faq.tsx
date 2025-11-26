import { useEffect, useState } from "react"
import Head from "next/head"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"

// Define FAQ interface locally to avoid server-side imports
interface FAQ {
  id: string
  question: string
  answer: string
  tags: string[]
  priority: number
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  // Data source options
  source?: "tina" | "static" | "mixed"
  collection?: string // TinaCMS collection name
  category?: string // FAQ category filter
  projectId?: string // Project-specific FAQs
  staticFaqs?: FAQItem[] // Fallback static FAQs
  tags?: string[] // Filter by tags
  limit?: number // Limit number of FAQs shown

  // Display options
  title?: string
  description?: string
  pageUrl: string
  contextType?: "general" | "property" | "investment"
  searchable?: boolean

  // TinaCMS integration
  tinaFaqs?: any[] // FAQs from TinaCMS
}

export default function FAQ({
  source = "static",
  collection,
  category,
  projectId,
  staticFaqs = [],
  tags,
  limit,
  title = "Frequently Asked Questions",
  description,
  pageUrl,
  contextType = "general",
  searchable = false,
  tinaFaqs,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [displayFaqs, setDisplayFaqs] = useState<FAQ[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])

  // Load FAQs based on provided data
  useEffect(() => {
    let faqs: FAQ[] = []

    if (tinaFaqs && tinaFaqs.length > 0) {
      // Use TinaCMS data
      faqs = tinaFaqs.map((item, index) => ({
        id: item.id || `tina-${index}`,
        question: item.question,
        answer: item.answer,
        tags: item.tags || [],
        priority: item.priority || index + 1,
      }))
    } else if (staticFaqs && staticFaqs.length > 0) {
      // Use static FAQs data
      faqs = staticFaqs.map((item, index) => ({
        id: `static-${index}`,
        question: item.question,
        answer: item.answer,
        tags: [],
        priority: index + 1,
      }))
    }

    // Filter by tags if provided
    if (tags && tags.length > 0) {
      faqs = faqs.filter((faq) => faq.tags.some((tag) => tags.includes(tag)))
    }

    // Apply limit if specified
    if (limit && limit > 0) {
      faqs = faqs.slice(0, limit)
    }

    // Sort by priority
    faqs.sort((a, b) => a.priority - b.priority)

    setDisplayFaqs(faqs)
    setFilteredFaqs(faqs)
  }, [staticFaqs, tags, limit, tinaFaqs])

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFaqs(displayFaqs)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = displayFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some((tag) => tag.toLowerCase().includes(query))
    )

    setFilteredFaqs(filtered)
    setOpenIndex(null) // Close any open FAQ when searching
  }, [searchQuery, displayFaqs])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: filteredFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof faq.answer === "string" ? faq.answer : faq.answer,
      },
    })),
    about: {
      "@type": "Thing",
      name:
        contextType === "property"
          ? "Real Estate Property"
          : contextType === "investment"
            ? "Property Investment"
            : "Real Estate Services",
    },
    publisher: {
      "@type": "Organization",
      name: "Narkin's Builders and Developers",
      url: "https://www.narkinsbuilders.com",
    },
    url: pageUrl,
  }

  if (filteredFaqs.length === 0) {
    return null
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="p-6 lg:p-8 rounded-3xl shadow-2xl ring-1 ring-gray-900/10 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]"
            style={{ backgroundColor: "#FAFAFA" }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
                {title}
              </h2>
              {description ? (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {description}
                </p>
              ) : (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Get answers to common questions about our luxury apartment
                  projects and services.
                </p>
              )}
            </div>

            {/* Search Bar */}
            {searchable && (
              <div className="mb-8">
                <div className="relative max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                {searchQuery && (
                  <p className="text-center mt-2 text-sm text-gray-600">
                    {filteredFaqs.length} result
                    {filteredFaqs.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="p-6 lg:p-8 rounded-3xl shadow-2xl ring-1 ring-gray-900/10 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]"
                  style={{ backgroundColor: "#FAFAFA" }}
                >
                  <button
                    className="w-full text-left flex justify-between items-center hover:bg-transparent focus:outline-none transition-colors"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <span className="text-lg text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  {openIndex === index && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="pt-4 text-gray-700 leading-relaxed animate-in slide-in-from-top-2 duration-200"
                    >
                      {typeof faq.answer === "string" ? (
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      ) : (
                        <div>{faq.answer}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No FAQs found matching "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:text-primary/80 "
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
