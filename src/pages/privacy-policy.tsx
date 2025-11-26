import React, { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import Navigation from "@/components/layout/navigation/navigation"
import Footer from "@/components/layout/footer/footer"
import { motion } from "framer-motion"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

const Privacy = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean
  }>({})
  const [activeSection, setActiveSection] = useState("")

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(sectionId)
    }
  }

  const sections = [
    { id: "introduction", title: "Introduction", icon: "1" },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      icon: "2",
    },
    { id: "how-we-collect", title: "How We Collect Information", icon: "3" },
    { id: "how-we-use", title: "How We Use Your Information", icon: "4" },
    { id: "information-sharing", title: "Information Sharing", icon: "5" },
    { id: "data-security", title: "Data Security", icon: "6" },
    { id: "cookies", title: "Cookies & Tracking", icon: "7" },
    { id: "third-party", title: "Third-Party Services", icon: "8" },
    { id: "your-rights", title: "Your Rights & Choices", icon: "9" },
    { id: "data-retention", title: "Data Retention", icon: "10" },
    { id: "international", title: "International Transfers", icon: "11" },
    { id: "children", title: "Children's Privacy", icon: "12" },
    { id: "changes", title: "Policy Changes", icon: "13" },
    { id: "contact", title: "Contact Information", icon: "14" },
  ]

  const SectionCard: React.FC<{
    id: string
    title: string
    children: React.ReactNode
    defaultExpanded?: boolean
  }> = ({ id, title, children, defaultExpanded = false }) => {
    const isExpanded = expandedSections[id] ?? defaultExpanded

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        id={id}
        className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <button
          onClick={() => toggleSection(id)}
          className="w-full p-6 lg:p-8 text-left flex items-center justify-between hover:bg-gray-50/50 rounded-t-2xl transition-colors"
        >
          <h2 className="text-xl lg:text-2xl text-gray-900 pr-4">{title}</h2>
          {isExpanded ? (
            <ChevronDownIcon className="h-6 w-6 text-gray-600 flex-shrink-0" />
          ) : (
            <ChevronRightIcon className="h-6 w-6 text-gray-600 flex-shrink-0" />
          )}
        </button>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 lg:px-8 pb-6 lg:pb-8"
          >
            <div className="prose prose-lg max-w-none text-gray-700">
              {children}
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <>
      <Head>
        <title>Privacy Policy | Narkin's Builders - Your Data Protection</title>
        <meta
          name="description"
          content="Learn how Narkin's Builders protects your personal information and privacy. Comprehensive privacy policy covering data collection, usage, and your rights."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://www.narkinsbuilders.com/privacy-policy"
        />
      </Head>

      <Navigation />

      {/* Hero Section - Matching your website's style */}
      <section className="relative isolate overflow-hidden pt-[10rem] pb-20 lg:pb-24 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm ">
                  Privacy Policy
                </div>
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2.5 rounded-xl text-sm ">
                  Last Updated: January 2025
                </div>
              </div>

              <h1 className="text-4xl lg:text-6xl text-gray-900 mb-6 leading-tight">
                Privacy Policy
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                How we protect and handle your personal information with
                transparency and care
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors ">
              Home
            </Link>
            <span className="mx-2">→</span>
            <span className="text-gray-900 ">Privacy Policy</span>
          </nav>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-lg border border-white/50"
            >
              <h2 className="text-2xl lg:text-3xl text-gray-900 mb-6 text-center">
                Quick Summary
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <h3 className=" text-gray-900 mb-2">We Protect</h3>
                  <p className="text-gray-600 text-sm">
                    Your personal and financial information with
                    industry-leading security
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <h3 className=" text-gray-900 mb-2">We Use Data</h3>
                  <p className="text-gray-600 text-sm">
                    Only to provide better real estate services and communicate
                    with you
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <h3 className=" text-gray-900 mb-2">Your Rights</h3>
                  <p className="text-gray-600 text-sm">
                    Access, update, or delete your data anytime by contacting us
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Table of Contents + Content */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            {/* Sticky Table of Contents */}
            <div className="lg:col-span-1 mb-12 lg:mb-0">
              <div className="lg:sticky lg:top-24">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className=" text-gray-900 mb-4 text-lg">
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                          activeSection === section.id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-sm text-gray-500">
                          {section.icon}
                        </span>
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="lg:col-span-3 space-y-8">
              <SectionCard
                id="introduction"
                title="1. Introduction"
                defaultExpanded={true}
              >
                <p className="mb-4">
                  Narkin's Builders is committed to protecting your privacy and
                  personal information. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when
                  you visit our website, use our services, or engage with our
                  real estate projects.
                </p>
                <p>
                  By using our services, you agree to the collection and use of
                  information in accordance with this policy. We are dedicated
                  to maintaining the highest standards of data protection and
                  transparency in all our operations.
                </p>
              </SectionCard>

              <SectionCard
                id="information-we-collect"
                title="2. Information We Collect"
              >
                <p className="mb-6">
                  We collect several types of information from and about users
                  of our website and services:
                </p>

                <h4 className=" text-gray-900 mb-3 text-lg">
                  Personal Information
                </h4>
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  <li>
                    Full name and contact information (phone number, email
                    address, mailing address)
                  </li>
                  <li>
                    Financial information (income, employment details,
                    investment capacity)
                  </li>
                  <li>
                    Government-issued identification documents (CNIC, passport)
                  </li>
                  <li>
                    Banking and payment information for property transactions
                  </li>
                  <li>Property preferences and investment interests</li>
                </ul>

                <h4 className=" text-gray-900 mb-3 text-lg">
                  Technical Information
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>IP address, browser type, and operating system</li>
                  <li>Website usage patterns and navigation behavior</li>
                  <li>Device information and unique identifiers</li>
                  <li>Cookies and tracking technologies data</li>
                </ul>
              </SectionCard>

              <SectionCard
                id="how-we-collect"
                title="3. How We Collect Information"
              >
                <p className="mb-4">
                  We collect information through various methods:
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700">
                  <li>
                    Direct interactions when you contact us or fill out forms
                  </li>
                  <li>Website cookies and tracking technologies</li>
                  <li>
                    Third-party services such as Google Analytics and Google
                    Maps
                  </li>
                  <li>Social media platforms and advertising networks</li>
                  <li>
                    Public records and databases for verification purposes
                  </li>
                  <li>Business partners and referral sources</li>
                </ul>
              </SectionCard>

              <SectionCard
                id="how-we-use"
                title="4. How We Use Your Information"
              >
                <p className="mb-4">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700">
                  <li>
                    Provide personalized property recommendations and investment
                    guidance
                  </li>
                  <li>
                    Process property bookings, sales, and related transactions
                  </li>
                  <li>
                    Communicate about our projects, offers, and market updates
                  </li>
                  <li>Improve our website functionality and user experience</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Prevent fraud and maintain security</li>
                </ul>
              </SectionCard>

              <SectionCard
                id="information-sharing"
                title="5. Information Sharing and Disclosure"
              >
                <p className="mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700">
                  <li>
                    With your consent - When you explicitly agree to information
                    sharing
                  </li>
                  <li>
                    Service providers - Third parties who assist in our
                    operations
                  </li>
                  <li>
                    Legal requirements - When required by law or legal process
                  </li>
                  <li>
                    Business transfers - In case of merger, acquisition, or sale
                  </li>
                  <li>
                    Protection of rights - To protect our legal rights and
                    safety
                  </li>
                </ul>
              </SectionCard>

              <SectionCard id="data-security" title="6. Data Security">
                <p className="mb-4">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Secure data storage and backup procedures</li>
                </ul>
              </SectionCard>

              <SectionCard
                id="cookies"
                title="7. Cookies and Tracking Technologies"
              >
                <p className="mb-4">
                  We use cookies and similar tracking technologies to enhance
                  your browsing experience and analyze website usage.
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies to understand user behavior</li>
                  <li>Marketing cookies for targeted advertising</li>
                  <li>Social media cookies for content sharing</li>
                </ul>
                <p className="mt-4 text-sm bg-blue-50 border border-blue-200 rounded-lg p-4">
                  Note: You can manage cookie preferences through your browser
                  settings or our cookie consent tool.
                </p>
              </SectionCard>

              <SectionCard id="third-party" title="8. Third-Party Services">
                <p className="mb-4">
                  Our website and services integrate with various third-party
                  services:
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700">
                  <li>Google Services - Analytics, Maps, and Advertising</li>
                  <li>
                    Social Media Platforms - Facebook, Instagram, WhatsApp
                  </li>
                  <li>
                    Payment Processors - For secure transaction processing
                  </li>
                  <li>Communication Tools - Email and messaging services</li>
                </ul>
              </SectionCard>

              <SectionCard id="your-rights" title="9. Your Rights and Choices">
                <p className="mb-4">
                  You have several rights regarding your personal information:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className=" text-gray-900 mb-2">Access Rights</h5>
                    <p className="text-sm text-gray-700">
                      Request copies of your personal data
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className=" text-gray-900 mb-2">Correction Rights</h5>
                    <p className="text-sm text-gray-700">
                      Update or correct your information
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className=" text-gray-900 mb-2">Deletion Rights</h5>
                    <p className="text-sm text-gray-700">
                      Request deletion of your data
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className=" text-gray-900 mb-2">
                      Communication Preferences
                    </h5>
                    <p className="text-sm text-gray-700">
                      Opt-out of marketing communications
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id="data-retention" title="10. Data Retention">
                <p>
                  We retain your personal information only for as long as
                  necessary to fulfill the purposes outlined in this privacy
                  policy, comply with legal obligations, resolve disputes, and
                  enforce our agreements.
                </p>
              </SectionCard>

              <SectionCard
                id="international"
                title="11. International Data Transfers"
              >
                <p>
                  Your information may be transferred to and processed in
                  countries other than Pakistan. We ensure appropriate
                  safeguards are in place to protect your personal information
                  during such transfers.
                </p>
              </SectionCard>

              <SectionCard id="children" title="12. Children's Privacy">
                <p>
                  Our services are not intended for children under 18 years of
                  age. We do not knowingly collect personal information from
                  children under 18. If you believe we have collected
                  information from a child under 18, please contact us
                  immediately.
                </p>
              </SectionCard>

              <SectionCard id="changes" title="13. Changes to This Policy">
                <p className="mb-4">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by posting the new policy
                  on this page and updating the "Last Updated" date.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically to
                  stay informed about how we are protecting your information.
                </p>
              </SectionCard>

              <SectionCard
                id="contact"
                title="14. Contact Information"
                defaultExpanded={true}
              >
                <p className="mb-6">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us:
                </p>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className=" text-gray-900 mb-3">Email Us</h5>
                      <p className="text-gray-700 mb-4">
                        For privacy-related inquiries
                      </p>
                      <a
                        href="mailto:info@narkinsbuilders.com"
                        className="text-blue-600 hover:text-blue-800 "
                      >
                        info@narkinsbuilders.com
                      </a>
                    </div>

                    <div>
                      <h5 className=" text-gray-900 mb-3">WhatsApp</h5>
                      <p className="text-gray-700 mb-4">
                        Quick response for urgent matters
                      </p>
                      <a
                        href="https://api.whatsapp.com/send?phone=923203243970&text=Hi!%20I%20have%20a%20privacy%20policy%20question."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors "
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487" />
                        </svg>
                        Message Us
                      </a>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home CTA */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-lg border border-gray-200"
          >
            <h3 className="text-2xl lg:text-3xl text-gray-900 mb-4">
              Ready to Explore Our Projects?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Discover premium apartments in Bahria Town Karachi with complete
              transparency and privacy protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ← Back to Home
              </Link>
              <Link
                href="/about"
                className="bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Learn About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer map="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.887654842134!2d67.31088117394069!3d25.003933139504262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34b0d0e2f0313%3A0x82f9da3499b223b1!2sHill%20Crest%20Residency!5e0!3m2!1sen!2s!4v1751481865917!5m2!1sen!2s" />
    </>
  )
}

export default Privacy
