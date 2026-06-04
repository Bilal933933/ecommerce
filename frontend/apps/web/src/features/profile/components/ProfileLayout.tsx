import type { ReactNode } from "react"

interface ProfileLayoutProps {
  sidebar: ReactNode
  main: ReactNode
}

export function ProfileLayout({ sidebar, main }: ProfileLayoutProps) {
  return (
    <div className="space-y-6">
      {sidebar}
      {main}
    </div>
  )
}
