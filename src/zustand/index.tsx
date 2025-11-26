import { create } from "zustand"

export const useGlobalLeadFormState = create<{
  open: boolean
  setOpen: (b: boolean) => void
}>((set) => ({
  open: false,
  setOpen: (b: boolean) => set({ open: b }),
}))
type LightboxState = {
  open: boolean
  image: {
    title?: string
    src: string
  }
  openLightbox: (image: { title?: string; src: string }) => void
  closeLightbox: () => void
}

export const useLightboxStore = create<LightboxState>((set) => ({
  open: false,
  image: { title: undefined, src: "" },
  openLightbox: (image: { title?: string; src: string }) =>
    set({ open: true, image }),
  closeLightbox: () =>
    set({ open: false, image: { title: undefined, src: "" } }),
}))
