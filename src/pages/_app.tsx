import { useEffect, useState } from "react"
import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import Head from "next/head"
import { GlobalLeadFormProvider } from "@/contexts/global"
import { useGlobalLeadFormState } from "@/zustand"
import { useAnalytics } from "@/hooks/useAnalytics"
import "@/styles/globals.css"

// Lazy-load components
const Dialog = dynamic(() => import("@/components/features/dialog/dialog"), {
  ssr: false, // Load only on the client side
})
const WAButton = dynamic(
  () => import("@/components/features/sticky-wa-button/wa-button"),
  {
    ssr: false, // Load only on the client side
  }
)
const AdsCampaign = dynamic(
  () => import("@/components/features/ads-campaign/ads-campaign"),
  {
    ssr: false, // Load only on the client side
  }
)

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false) // Track client-side rendering
  const open = useGlobalLeadFormState((state) => state.open)
  const setOpen = useGlobalLeadFormState((state) => state.setOpen)

  // Initialize analytics tracking
  useAnalytics()

  // Ensure this runs only on the client side
  useEffect(() => {
    setIsClient(true)

    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      const swPath =
        process.env.NODE_ENV === "development" ? "/sw-dev.js" : "/sw.js"
      navigator.serviceWorker
        .register(swPath)
        .then((registration) => {})
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error)
        })
    }
  }, [])

  return (
    <>
      {/* Global viewport meta tag - applies to all pages */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="text-black dark:text-black">
        {/* Render Dialog only on the client side */}
        {isClient && (
          <Dialog
            title=""
            open={open}
            onClose={() => setOpen(false)}
            body={
              <AdsCampaign
                onlyForm={true}
                residency="General"
                image={
                  "http://admin.narkinsbuilders.com/wp-content/uploads/2024/06/Picture1.webp"
                }
                headline={"2, 3 & 4 Bedroom Luxury Apartments"}
                features={[]}
              />
            }
            showButtons={false}
            cancelButton={{
              title: "",
              onClick: () => {},
            }}
            acceptButton={{
              title: "",
              onClick: () => {},
            }}
          />
        )}

        {/* Render WAButton only on the client side */}
        {isClient && <WAButton />}

        {/* Global Lead Form Provider */}
        <GlobalLeadFormProvider>
          <Component {...pageProps} />
        </GlobalLeadFormProvider>
      </div>
    </>
  )
}
