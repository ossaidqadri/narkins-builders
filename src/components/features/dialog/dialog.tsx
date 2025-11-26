// src/components/dialog/dialog.tsx
import React, { FC, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/common/ui/button"
import { useDialogBehavior } from "@/hooks/useDialogBehavior"
import DOMPurify from "dompurify"

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  body: React.ReactNode
  showButtons?: boolean
  cancelButton?: {
    title: string
    onClick: () => void
  }
  acceptButton?: {
    title: string
    onClick: () => void
  }
}

/**
 * Reusable Dialog component with automatic behavior handling
 * Supports click-outside, escape key, and body scroll prevention
 */
const Dialog: FC<DialogProps> = ({
  open,
  onClose,
  title,
  body,
  showButtons = true,
  cancelButton = { title: "Cancel", onClick: () => onClose() },
  acceptButton = { title: "Confirm", onClick: () => onClose() },
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Use custom hook for all dialog behaviors
  useDialogBehavior({
    isOpen: open,
    onClose,
    dialogRef,
    enableClickOutside: true,
    enableEscapeKey: true,
    preventBodyScroll: true,
  })

  // Early return if dialog is closed
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all"
      >
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-lg opacity-80 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
          >
            <X className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Close</span>
          </button>

          {/* Title - Only show if title exists */}
          {title && (
            <h3 className="text-lg leading-6 text-gray-900 pr-8 mb-4">
              {title}
            </h3>
          )}

          {/* Body Content */}
          <div className={title ? "mt-4" : ""}>
            {typeof body === "string" ? (
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }}
              />
            ) : (
              body
            )}
          </div>

          {/* Action Buttons */}
          {showButtons && (
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={cancelButton.onClick}>
                {cancelButton.title}
              </Button>
              <Button onClick={acceptButton.onClick}>
                {acceptButton.title}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dialog
