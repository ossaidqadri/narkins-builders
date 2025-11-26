// src/hooks/useDialogBehavior.ts
import { RefObject, useEffect } from "react"

interface UseDialogBehaviorOptions {
  isOpen: boolean
  onClose: () => void
  dialogRef: RefObject<HTMLDivElement>
  enableClickOutside?: boolean
  enableEscapeKey?: boolean
  preventBodyScroll?: boolean
}

/**
 * Custom hook that handles all common dialog behaviors:
 * - Click outside to close
 * - Escape key to close
 * - Body scroll prevention
 */
export const useDialogBehavior = ({
  isOpen,
  onClose,
  dialogRef,
  enableClickOutside = true,
  enableEscapeKey = true,
  preventBodyScroll = true,
}: UseDialogBehaviorOptions) => {
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        enableClickOutside &&
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (enableEscapeKey && event.key === "Escape") {
        onClose()
      }
    }

    // Add event listeners
    if (enableClickOutside) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    if (enableEscapeKey) {
      document.addEventListener("keydown", handleEscape)
    }

    // Handle body scroll
    if (preventBodyScroll) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"

      return () => {
        document.body.style.overflow = originalOverflow
        if (enableClickOutside) {
          document.removeEventListener("mousedown", handleClickOutside)
        }
        if (enableEscapeKey) {
          document.removeEventListener("keydown", handleEscape)
        }
      }
    }

    // Cleanup without body scroll handling
    return () => {
      if (enableClickOutside) {
        document.removeEventListener("mousedown", handleClickOutside)
      }
      if (enableEscapeKey) {
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [
    isOpen,
    onClose,
    dialogRef,
    enableClickOutside,
    enableEscapeKey,
    preventBodyScroll,
  ])
}
