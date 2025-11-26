import { createContext, ReactNode, useState } from "react"

export const GlobalLeadFormContext = createContext({
  open: false,
  setOpen: (open: boolean) => {},
})
export const GlobalLeadFormProvider = ({
  children,
}: {
  children: ReactNode | Array<ReactNode>
}) => {
  const [open, setOpen] = useState(false)
  return (
    <GlobalLeadFormContext.Provider value={{ open, setOpen }}>
      {children}
    </GlobalLeadFormContext.Provider>
  )
}
