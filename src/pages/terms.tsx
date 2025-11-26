import React, { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import Navigation from "@/components/layout/navigation/navigation"
import Footer from "@/components/layout/footer/footer"
import { motion } from "framer-motion"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

const Terms = () => {
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
    { id: "acceptance", title: "Acceptance of Terms", icon: "1" },
    { id: "company-info", title: "Company Information", icon: "2" },
    { id: "property-info", title: "Property Information", icon: "3" },
    { id: "investment-risks", title: "Investment Risks", icon: "4" },
    { id: "booking-payment", title: "Booking & Payment", icon: "5" },
    { id: "intellectual-property", title: "Intellectual Property", icon: "6" },
    { id: "website-use", title: "Website Use", icon: "7" },
    { id: "liability", title: "Limitation of Liability", icon: "8" },
    { id: "indemnification", title: "Indemnification", icon: "9" },
    { id: "termination", title: "Termination", icon: "10" },
    { id: "governing-law", title: "Governing Law", icon: "11" },
    { id: "dispute-resolution", title: "Dispute Resolution", icon: "12" },
    { id: "modifications", title: "Modifications", icon: "13" },
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
        <title>Terms of Service | Narkin's Builders - Service Agreement</title>
        <meta
          name="description"
          content="Terms of Service for Narkin's Builders. Comprehensive terms covering real estate services, property investments, and website usage."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.narkinsbuilders.com/terms" />
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
                  Service Agreement
                </div>
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm ">
                  Last Updated: January 2025
                </div>
              </div>

              <h1 className="text-4xl lg:text-6xl text-gray-900 mb-6 leading-tight">
                Terms of Service
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Clear and transparent terms for using our real estate services
                and website
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
            <span className="text-gray-900 ">Terms of Service</span>
          </nav>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-lg border border-white/50"
            >
              <h2 className="text-2xl lg:text-3xl text-gray-900 mb-6 text-center">
                Key Highlights
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <h3 className=" text-gray-900 mb-2">Fair Terms</h3>
                  <p className="text-gray-600 text-sm">
                    Transparent and honest terms for all our real estate
                    services
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <h3 className=" text-gray-900 mb-2">Property Rights</h3>
                  <p className="text-gray-600 text-sm">
                    Clear guidelines for property investments and ownership
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <h3 className=" text-gray-900 mb-2">Support</h3>
                  <p className="text-gray-600 text-sm">
                    24/7 customer support for all your questions and concerns
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
                            ? "bg-green-100 text-green-700"
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
                id="acceptance"
                title="1. Acceptance of Terms"
                defaultExpanded={true}
              >
                <p className="mb-4">
                  By accessing or using the Narkin's Builders website, services,
                  or engaging with our real estate projects, you agree to be
                  bound by these Terms of Service and our Privacy Policy.
                </p>
                <p className="mb-4">
                  If you do not agree to these terms, please do not use our
                  services. These terms constitute a legally binding agreement
                  between you and Narkin's Builders.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-yellow-800">
                    Important: Please read these terms carefully before using
                    our services or making any property investments.
                  </p>
                </div>
              </SectionCard>

              <SectionCard id="company-info" title="2. Company Information">
                <p className="mb-4">
                  Narkin's Builders and Developers is a registered real estate
                  development company operating in Pakistan, specializing in
                  premium residential projects in Bahria Town Karachi.
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className=" text-gray-900 mb-3 text-lg">
                    Company Details
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>Company Name: Narkin's Builders and Developers</li>
                    <li>Registration: Registered under Pakistani law</li>
                    <li>Business Type: Real Estate Development</li>
                    <li>Specialization: Premium residential projects</li>
                    <li>Primary Location: Bahria Town Karachi, Pakistan</li>
                  </ul>
                </div>
              </SectionCard>

              <SectionCard
                id="property-info"
                title="3. Property Information and Representations"
              >
                <p className="mb-4">
                  All property information provided on our website and marketing
                  materials is based on current development plans and is subject
                  to change.
                </p>
                <h4 className=" text-gray-900 mb-3 text-lg">
                  Property Disclaimers
                </h4>
                <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
                  <li>
                    Property images and renderings are artistic representations
                  </li>
                  <li>
                    Final constructions may vary from promotional materials
                  </li>
                  <li>
                    Amenities and features are subject to regulatory approvals
                  </li>
                  <li>
                    Completion timelines are estimates and may be subject to
                    delays
                  </li>
                  <li>All dimensions and square footages are approximate</li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Tip: Always verify property details with our sales team
                    before making investment decisions.
                  </p>
                </div>
              </SectionCard>

              <SectionCard
                id="investment-risks"
                title="4. Investment Risks and Disclaimers"
              >
                <p className="mb-4">
                  Real estate investments carry inherent risks, and past
                  performance does not guarantee future results.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <h4 className=" text-red-900 mb-3 text-lg">
                    Investment Risks
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-red-800">
                    <li>Market fluctuations may affect property values</li>
                    <li>
                      Construction delays may occur due to unforeseen
                      circumstances
                    </li>
                    <li>Regulatory changes may impact project development</li>
                    <li>
                      Economic conditions may affect property demand and pricing
                    </li>
                    <li>
                      Force majeure events may cause project delays or
                      modifications
                    </li>
                  </ul>
                </div>
                <p className="text-gray-700">
                  We recommend consulting with financial advisors before making
                  investment decisions. Narkin's Builders does not provide
                  financial advice and is not responsible for investment
                  outcomes.
                </p>
              </SectionCard>

              <SectionCard
                id="booking-payment"
                title="5. Booking and Payment Terms"
              >
                <p className="mb-4">
                  Property bookings are subject to availability and our payment
                  terms:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className=" text-gray-900 mb-2">Payment Schedule</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Booking amount upon reservation</li>
                      <li>• Down payment within specified timeframe</li>
                      <li>• Installments as per agreed schedule</li>
                      <li>• Final payment upon possession</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className=" text-gray-900 mb-2">Booking Terms</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Subject to availability</li>
                      <li>• Non-refundable booking fees</li>
                      <li>• Payment schedule must be maintained</li>
                      <li>• Legal documentation required</li>
                    </ul>
                  </div>
                </div>

                <h4 className=" text-gray-900 mb-3 text-lg">
                  Cancellation Policy
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Cancellation terms vary by project and payment stage</li>
                  <li>
                    Early cancellation may result in forfeiture of paid amounts
                  </li>
                  <li>Refund processing may take 30-90 business days</li>
                  <li>Administrative charges may apply to cancellations</li>
                </ul>
              </SectionCard>

              <SectionCard
                id="intellectual-property"
                title="6. Intellectual Property Rights"
              >
                <p className="mb-4">
                  All content on our website, including text, images, designs,
                  logos, and marketing materials, is protected by intellectual
                  property rights.
                </p>
                <ul className="list-disc list-inside space-y-3 text-gray-700">
                  <li>
                    Website content is owned by Narkin's Builders or licensed to
                    us
                  </li>
                  <li>
                    Unauthorized use, reproduction, or distribution is
                    prohibited
                  </li>
                  <li>
                    Company logos and trademarks are registered intellectual
                    property
                  </li>
                  <li>
                    Property designs and architectural plans are proprietary
                  </li>
                  <li>
                    Marketing materials may only be used with our written
                    permission
                  </li>
                </ul>
              </SectionCard>

              <SectionCard
                id="website-use"
                title="7. Website Use and Prohibited Activities"
              >
                <p className="mb-4">
                  When using our website and services, you agree to comply with
                  all applicable laws and the following restrictions:
                </p>

                <h4 className=" text-gray-900 mb-3 text-lg">Permitted Uses</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li>Browsing property information for personal use</li>
                  <li>Contacting us for legitimate inquiries</li>
                  <li>Sharing content with proper attribution</li>
                  <li>Using contact forms for their intended purpose</li>
                </ul>

                <h4 className=" text-gray-900 mb-3 text-lg">
                  Prohibited Activities
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Using automated tools to scrape our content</li>
                  <li>Transmitting malicious code or viruses</li>
                  <li>Impersonating our company or employees</li>
                  <li>Using our services for fraudulent activities</li>
                  <li>Violating any applicable laws or regulations</li>
                </ul>
              </SectionCard>

              <SectionCard id="liability" title="8. Limitation of Liability">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <h4 className=" text-yellow-900 mb-3 text-lg">
                    Liability Limitations
                  </h4>
                  <p className="text-yellow-800 mb-4">
                    Narkin's Builders' liability is limited to the maximum
                    extent permitted by law. We are not liable for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-yellow-800">
                    <li>Indirect, incidental, or consequential damages</li>
                    <li>Loss of profits, data, or business opportunities</li>
                    <li>Damages resulting from third-party actions</li>
                    <li>Force majeure events beyond our control</li>
                    <li>Market fluctuations affecting property values</li>
                  </ul>
                </div>
                <p className="text-gray-700">
                  Our maximum liability for any claim shall not exceed the
                  amount you have paid to us for the specific service or
                  property in question.
                </p>
              </SectionCard>

              <SectionCard id="indemnification" title="9. Indemnification">
                <p className="mb-4">
                  You agree to indemnify and hold harmless Narkin's Builders,
                  its officers, directors, employees, and agents from any
                  claims, losses, or damages arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Your use of our services or website</li>
                  <li>Your violation of these terms of service</li>
                  <li>Your violation of any applicable laws</li>
                  <li>Your infringement of third-party rights</li>
                  <li>Any false or misleading information you provide</li>
                </ul>
              </SectionCard>

              <SectionCard id="termination" title="10. Termination">
                <p className="mb-4">
                  We reserve the right to terminate or suspend your access to
                  our services at any time for violations of these terms.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className=" text-gray-900 mb-2">
                      Grounds for Termination
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Violation of terms of service</li>
                      <li>• Fraudulent activities</li>
                      <li>• Misuse of our services</li>
                      <li>• Legal requirements</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className=" text-gray-900 mb-2">
                      Effect of Termination
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Immediate cessation of services</li>
                      <li>• Outstanding obligations remain</li>
                      <li>• Data may be deleted</li>
                      <li>• Survival of certain clauses</li>
                    </ul>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id="governing-law" title="11. Governing Law">
                <p className="mb-4">
                  These Terms of Service are governed by and construed in
                  accordance with the laws of Pakistan.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Pakistani law governs all aspects of this agreement</li>
                  <li>
                    Any disputes will be subject to Pakistani jurisdiction
                  </li>
                  <li>
                    Courts of Karachi, Pakistan have exclusive jurisdiction
                  </li>
                  <li>
                    Islamic principles of contract law may apply where relevant
                  </li>
                </ul>
              </SectionCard>

              <SectionCard
                id="dispute-resolution"
                title="12. Dispute Resolution"
              >
                <p className="mb-4">
                  We encourage resolving disputes through direct communication.
                  If that fails, the following process applies:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 text-blue-700 rounded-full p-2 flex-shrink-0">
                      <span className="text-sm ">1</span>
                    </div>
                    <div>
                      <h5 className=" text-gray-900 mb-1">
                        Direct Negotiation
                      </h5>
                      <p className="text-gray-700 text-sm">
                        Contact our customer service team to resolve the issue
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 text-blue-700 rounded-full p-2 flex-shrink-0">
                      <span className="text-sm ">2</span>
                    </div>
                    <div>
                      <h5 className=" text-gray-900 mb-1">Mediation</h5>
                      <p className="text-gray-700 text-sm">
                        Attempt resolution through a neutral third-party
                        mediator
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 text-blue-700 rounded-full p-2 flex-shrink-0">
                      <span className="text-sm ">3</span>
                    </div>
                    <div>
                      <h5 className=" text-gray-900 mb-1">Legal Action</h5>
                      <p className="text-gray-700 text-sm">
                        Final recourse through Pakistani courts if other methods
                        fail
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="modifications"
                title="13. Modifications to Terms"
              >
                <p className="mb-4">
                  We reserve the right to modify these terms at any time.
                  Changes will be effective immediately upon posting on our
                  website.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li>Updated terms will be posted on this page</li>
                  <li>Material changes may be communicated via email</li>
                  <li>Continued use constitutes acceptance of new terms</li>
                  <li>We recommend reviewing terms periodically</li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Stay Updated: Bookmark this page and check back regularly
                    for any updates to our terms.
                  </p>
                </div>
              </SectionCard>

              <SectionCard
                id="contact"
                title="14. Contact Information"
                defaultExpanded={true}
              >
                <p className="mb-6">
                  If you have any questions about these Terms of Service or need
                  assistance with our services, please contact us:
                </p>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className=" text-gray-900 mb-3">Email Support</h5>
                      <p className="text-gray-700 mb-4">
                        For terms and legal inquiries
                      </p>
                      <a
                        href="mailto:info@narkinsbuilders.com"
                        className="text-green-600 hover:text-green-800 "
                      >
                        info@narkinsbuilders.com
                      </a>
                    </div>

                    <div>
                      <h5 className=" text-gray-900 mb-3">WhatsApp Support</h5>
                      <p className="text-gray-700 mb-4">
                        Quick response for urgent matters
                      </p>
                      <a
                        href="https://api.whatsapp.com/send?phone=923203243970&text=Hi!%20I%20have%20a%20question%20about%20your%20terms%20of%20service."
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

                  <div className="mt-6 pt-6 border-t border-green-200">
                    <h5 className=" text-gray-900 mb-3">Office Address</h5>
                    <p className="text-gray-700">
                      Narkin's Builders and Developers
                      <br />
                      Hill Crest Residency
                      <br />
                      Bahria Town Karachi
                      <br />
                      Pakistan
                    </p>
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
              Ready to Start Your Property Journey?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Explore our premium projects in Bahria Town Karachi with full
              transparency and legal protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ← Back to Home
              </Link>
              <Link
                href="/privacy-policy"
                className="bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Privacy Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer map="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.887654842134!2d67.31088117394069!3d25.003933139504262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34b0d0e2f0313%3A0x82f9da3499b223b1!2sHill%20Crest%20Residency!5e0!3m2!1sen!2s!4v1751481865917!5m2!1sen!2s" />
    </>
  )
}

export default Terms
