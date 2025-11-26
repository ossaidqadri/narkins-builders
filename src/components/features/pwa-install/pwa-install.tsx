"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showSafariPrompt, setShowSafariPrompt] = useState(false)
  const [isSafari, setIsSafari] = useState(false)

  const detectSafari = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isSafariMobile =
      /safari/.test(userAgent) &&
      /mobile/.test(userAgent) &&
      !/chrome/.test(userAgent)
    const isSafariDesktop =
      /safari/.test(userAgent) &&
      !/chrome/.test(userAgent) &&
      !/mobile/.test(userAgent)
    return isSafariMobile || isSafariDesktop
  }

  const isStandalone = () => {
    return (
      (window.matchMedia &&
        window.matchMedia("(display-mode: standalone)").matches) ||
      (window.navigator as any).standalone === true
    )
  }

  useEffect(() => {
    const safari = detectSafari()
    setIsSafari(safari)

    // Don't show prompt if already in standalone mode (already installed)
    if (isStandalone()) {
      return
    }

    // For Safari, show custom prompt after some interaction
    if (safari) {
      const timer = setTimeout(() => {
        setShowSafariPrompt(true)
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }

    // For other browsers, use beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // For Chrome/Edge - add fallback prompt if no beforeinstallprompt after 5 seconds
    const fallbackTimer = setTimeout(() => {
      if (!safari && !deferredPrompt) {
        setShowInstallPrompt(true)
      }
    }, 5000)

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    )

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      )
      clearTimeout(fallbackTimer)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback: show manual install instructions for Chrome
      alert(
        'To install:\n1. Click the menu (⋮) in Chrome\n2. Select "Install app" or look for the install icon in the address bar\n3. Or check if the app is already installed'
      )
      setShowInstallPrompt(false)
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  const handleSafariDismiss = () => {
    setShowSafariPrompt(false)
  }

  // Show Safari-specific prompt
  if (showSafariPrompt && isSafari) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-black text-white p-4 rounded-lg shadow-lg z-50">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-xl ">
            N
          </div>
          <div className="flex-1">
            <h3 className=" text-sm mb-1">Install Narkin's Builders</h3>
            <p className="text-xs text-gray-300 mb-3">
              Add to your home screen for quick access to luxury apartments and
              project updates.
            </p>
            <div className="bg-gray-800 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
                  ↗
                </div>
                <span>Tap the Share button</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                <div className="w-4 h-4 bg-gray-600 rounded flex items-center justify-center text-white text-xs">
                  +
                </div>
                <span>Select "Add to Home Screen"</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <span>Tap "Add" to confirm</span>
              </div>
            </div>
            <button
              onClick={handleSafariDismiss}
              className="text-gray-300 px-3 py-1 rounded text-xs hover:text-white transition-colors w-full text-center border border-gray-600"
            >
              Got it
            </button>
          </div>
          <button
            onClick={handleSafariDismiss}
            className="text-gray-400 hover:text-white p-1"
          >
            ×
          </button>
        </div>
      </div>
    )
  }

  // Show standard prompt for other browsers
  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-black text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-xl ">
          N
        </div>
        <div className="flex-1">
          <h3 className=" text-sm mb-1">Install Narkin's Builders</h3>
          <p className="text-xs text-gray-300 mb-3">
            Get quick access to our luxury apartments and receive updates on new
            projects.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-white text-black px-3 py-1 rounded text-xs hover:bg-gray-100 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-300 px-3 py-1 rounded text-xs hover:text-white transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white p-1"
        >
          ×
        </button>
      </div>
    </div>
  )
}
