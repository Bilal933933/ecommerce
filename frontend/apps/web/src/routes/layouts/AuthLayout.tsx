import { Outlet } from "react-router-dom"
import { useAppStore } from "@workspace/store/useAppStore"

export function AuthLayout() {
  const { language } = useAppStore()

  return (
    <div className="flex flex-col min-h-svh bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-64 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="w-full max-w-md relative">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
