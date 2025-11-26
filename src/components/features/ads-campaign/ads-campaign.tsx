import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/common/ui/button"
import { Input } from "@/components/common/ui/input"
import { Label } from "@/components/common/ui/label"
import { Building, Building2, ChevronDown, MapPin } from "lucide-react"
import { useFormAnalytics } from "@/hooks/useAnalytics"
import { event as trackEvent } from "@/lib/gtag"

// Residency options with details
const residencyOptions = [
  {
    id: "nbr",
    value: "Narkin's Boutique Residency",
    label: "Narkin's Boutique Residency (NBR)",
    shortLabel: "NBR",
    description: "Luxury apartments with modern amenities",
    features: [
      "2, 3 & 4 Bedroom Apartments",
      "Premium Location",
      "Modern Architecture",
    ],
    icon: Building2,
    color: "bg-blue-50 border-blue-200 text-blue-800",
  },
  {
    id: "hcr",
    value: "Hill Crest Residency",
    label: "Hill Crest Residency (HCR)",
    shortLabel: "HCR",
    description: "Serene living with panoramic views",
    features: [
      "2, 3 & 4 Bedroom Apartments",
      "Jinnah View",
      "Premium Finishes",
    ],
    icon: Building,
    color: "bg-green-50 border-green-200 text-green-800",
  },
]

interface AdsCampaignProps {
  headline?: string
  image?: string
  onlyForm: boolean
  features: Array<string>
  residency: "Narkin's Boutique Residency" | "Hill Crest Residency" | "General"
  imageWidth?: number
  imageHeight?: number
  mapUrl?: string
}

const AdsCampaign: React.FC<AdsCampaignProps> = ({
  headline,
  image,
  onlyForm,
  features,
  residency,
  imageWidth = 600,
  imageHeight = 900,
  mapUrl,
}) => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [selectedResidency, setSelectedResidency] = useState(
    residency === "General"
      ? residencyOptions[0]
      : residencyOptions.find((r) => r.value === residency) ||
          residencyOptions[0]
  )
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [error, setError] = useState(false)
  const [backupStatus, setBackupStatus] = useState({
    primaryForm: false,
    backupForm: false,
    localSaved: false,
  })

  const { trackFormStart, trackFormSubmit, trackFormError } = useFormAnalytics()

  // Auto-save form data to localStorage
  useEffect(() => {
    const formData = { name, email, number, property: selectedResidency.value }
    localStorage.setItem("leadFormData", JSON.stringify(formData))
  }, [name, email, number, selectedResidency])

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("leadFormData")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        if (parsed.name) setName(parsed.name)
        if (parsed.email) setEmail(parsed.email)
        if (parsed.number) setNumber(parsed.number)
        if (parsed.property) {
          const savedResidency = residencyOptions.find(
            (r) => r.value === parsed.property
          )
          if (savedResidency) setSelectedResidency(savedResidency)
        }
      } catch (error) {
        console.error("Error loading saved form data:", error)
      }
    }
  }, [])

  // Track form start
  const handleFormStart = () => {
    trackFormStart("quote")
  }

  // Handle residency selection
  const handleResidencySelect = (option: (typeof residencyOptions)[0]) => {
    setSelectedResidency(option)
    setIsDropdownOpen(false)

    // Track property selection
    trackEvent({
      action: "property_selection",
      category: "Lead Generation",
      label: option.value,
    })
  }

  // Track field completion
  const handleFieldComplete = (fieldName: string) => {
    trackEvent({
      action: "form_field_complete",
      category: "Lead Generation",
      label: fieldName,
    })
  }

  // GOOGLE SHEETS API SUBMISSION
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(false)
    setBackupStatus({ primaryForm: false, backupForm: false, localSaved: true })

    const leadData = {
      name,
      email,
      phone: number,
      property: selectedResidency.value,
      timestamp: new Date().toISOString(),
      source: "website_form",
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // Track form submission attempt
    trackEvent({
      action: "form_submit_attempt",
      category: "Lead Generation",
      label: selectedResidency.value,
    })

    let successCount = 0

    // GOOGLE SHEETS API METHOD
    try {
      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        successCount++
        setBackupStatus((prev) => ({ ...prev, primaryForm: true }))
      } else {
        throw new Error(result.message || "Failed to submit to Google Sheets")
      }
    } catch (error) {
      console.error("❌ Google Sheets API failed:", error)
    }

    // BACKUP METHOD: Store in IndexedDB for manual recovery
    try {
      const request = indexedDB.open("GoogleLeadsDB", 1)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains("leads")) {
          const store = db.createObjectStore("leads", {
            keyPath: "id",
            autoIncrement: true,
          })
          store.createIndex("timestamp", "timestamp", { unique: false })
          store.createIndex("synced", "synced", { unique: false })
        }
      }
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(["leads"], "readwrite")
        const store = transaction.objectStore("leads")
        store.add({
          ...leadData,
          synced: successCount > 0,
          sheetsSuccess: successCount > 0,
          submissionCount: successCount,
        })
      }
    } catch (error) {
      console.error("❌ IndexedDB storage failed:", error)
    }

    // Determine success
    if (successCount > 0) {
      setResponseMessage(
        "Thank you for submitting your inquiry! We'll get back to you shortly."
      )

      // Track successful form submission
      trackFormSubmit("quote", selectedResidency.value)

      // Track as conversion
      trackEvent({
        action: "conversion",
        category: "Lead Generation",
        label: `Quote Request - ${selectedResidency.value}`,
        value: 1,
      })

      // Track sheets success
      trackEvent({
        action: "sheets_success",
        category: "Lead Generation",
        label: "google_sheets_api",
        value: successCount,
      })

      // Clear form and localStorage
      setName("")
      setEmail("")
      setNumber("")
      localStorage.removeItem("leadFormData")
    } else {
      setError(true)
      setResponseMessage(
        "There was an issue submitting your inquiry. " +
          "Your data has been saved securely in your browser. " +
          "Please try again in a moment or contact us directly at: " +
          "info@narkinsbuilders.com or +92-XXX-XXXXXXX"
      )
      trackFormError("quote", "google_sheets_failed")
    }

    setLoading(false)
  }

  const IconComponent = selectedResidency.icon

  return (
    <div
      className={`grid gap-6 ${onlyForm ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}
    >
      {!onlyForm && (
        <>
          <div className="image-column">
            <Image
              src={
                image ??
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKae8kU5_6tMlx_wVGwVbbPTMbhekm6x__Sg&s"
              }
              alt="Residency"
              className="w-full rounded-lg h-auto mb-4"
              width={imageWidth}
              height={imageHeight}
            />
          </div>
          <div className="text-center">
            <h2 className="subheading tracking-tight mb-2 text-black">
              {headline}
            </h2>
            <h2 className="subsection-title tracking-tight text-black">
              Available on easy installment plans
            </h2>
            {mapUrl ? (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-neutral-100 border my-4 rounded-xl hover:bg-neutral-200 cursor-pointer transition-colors"
              >
                <MapPin className="inline w-4 h-4 mr-2" />
                Bahria Town Karachi
              </a>
            ) : (
              <div className="p-2 bg-neutral-100 border my-4 rounded-xl">
                <MapPin className="inline w-4 h-4 mr-2" />
                Bahria Town Karachi
              </div>
            )}
            <ul className="list-disc body-text text-left pl-5 space-y-2">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="relative">
        {/* Removed: Google Security Badge */}

        <form
          className="space-y-4 mt-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          onSubmit={handleSubmit}
        >
          {/* Removed: Google Protection Text */}

          {/* Residency Selection Dropdown */}
          <div>
            <Label htmlFor="residency" className="text-neutral-700 ">
              I'm interested in
            </Label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className=" text-gray-900">
                        {selectedResidency.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedResidency.description}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {residencyOptions.map((option) => {
                    const OptionIcon = option.icon
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleResidencySelect(option)}
                        className="w-full px-3 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-start space-x-3">
                          <OptionIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className=" text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-500 mb-2">
                              {option.description}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {option.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${option.color}`}
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <Label htmlFor="name" className="text-neutral-700">
              Full Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                handleFormStart()
              }}
              onBlur={() => name && handleFieldComplete("name")}
              required
              className="mt-1 bg-transparent text-black placeholder:text-neutral-700"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-neutral-700">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                handleFormStart()
              }}
              onBlur={() => email && handleFieldComplete("email")}
              required
              className="mt-1 bg-transparent text-black placeholder:text-neutral-700"
            />
          </div>

          <div>
            <Label htmlFor="number" className="text-neutral-700">
              Phone Number
            </Label>
            <Input
              type="tel"
              id="number"
              placeholder="Enter your phone number"
              value={number}
              onChange={(e) => {
                setNumber(e.target.value)
                handleFormStart()
              }}
              onBlur={() => number && handleFieldComplete("phone")}
              required
              className="mt-1 bg-transparent text-black placeholder:text-neutral-700"
            />
          </div>

          {/* Removed: Backup Status Indicators */}

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-black text-white hover:bg-black/90 py-3 text-base "
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>

          {/* Removed: Auto-save indicator */}
        </form>
      </div>

      {responseMessage && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            error
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">{error ? "❌" : "✅"}</div>
            <div className="ml-3">
              <p className="text-sm ">{responseMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdsCampaign
