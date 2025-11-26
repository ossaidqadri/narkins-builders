import { useEffect, useState } from "react"
import Head from "next/head"

export default function TinaAdminPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <>
        <Head>
          <title>CMS Admin - Narkin's Builders</title>
          <meta name="robots" content="noindex, nofollow" />
          <link
            rel="canonical"
            href="https://www.narkinsbuilders.com/admin-tina"
          />
        </Head>
        <div>Loading OtherDev CMS...</div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>CMS Admin - Narkin's Builders</title>
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href="https://www.narkinsbuilders.com/admin-tina"
        />
      </Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl text-gray-900 mb-4">
            OtherDev CMS Solutions
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 mb-4">
              This is a placeholder for the full OtherDev CMS admin interface.
            </p>
            <p className="text-blue-700 text-sm">
              Once you set up your CMS credentials, this will become the visual
              editor.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
