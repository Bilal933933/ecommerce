import type { ReactNode } from "react"
import { useAppStore } from "@workspace/store"
import { useTheme } from "./theme-provider"
import { cn } from "@workspace/ui/lib/utils"

interface LayoutProps {
  children: ReactNode
  className?: string
}

export function Layout({ children, className }: LayoutProps) {
  const { language } = useAppStore()
  const { theme } = useTheme()

  return (
    <div
      className={cn("min-h-svh bg-background text-foreground transition-colors duration-300", className)}
      dir={language === "ar" ? "rtl" : "ltr"}
      data-theme={theme}
      data-language={language}
    >
      {children}
    </div>
  )
}
