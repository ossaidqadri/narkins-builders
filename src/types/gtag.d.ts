// types/gtag.d.ts
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: {
        page_path?: string
        event_category?: string
        event_label?: string
        value?: number
        custom_parameter?: string
        send_page_view?: boolean
      }
    ) => void
  }
}

export {}
