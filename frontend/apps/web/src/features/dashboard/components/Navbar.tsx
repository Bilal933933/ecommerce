import { Link } from "react-router-dom"
import { useAppStore, useAuthStore, selectUser } from "@workspace/store"
import { locales } from "@workspace/locales"
import { Button } from "@workspace/ui/index"
import { ModeToggle } from "@/components/mode-toggle"
import { GraduationCap, LogOut } from "lucide-react"

export function DashboardNavbar() {
  const { language, setLanguage } = useAppStore()
  const user = useAuthStore(selectUser)
  const logout = useAuthStore((s) => s.logout)
  const t = locales[language].app

  return (
    <nav className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center px-6 shrink-0">
      <div className="flex-1 flex items-center gap-3">
        <GraduationCap className="w-6 h-6 text-primary" />
        <span className="font-semibold">{t.appName}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{user?.name || t.guest}</span>
        <Button variant="ghost" size="sm" onClick={logout}><LogOut className="w-4 h-4" /></Button>
        <ModeToggle />
        <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "ar" ? "en" : "ar")}>
          {language === "ar" ? "English" : "العربية"}
        </Button>
        <Button variant="outline" size="sm" asChild><Link to="/">{t.home}</Link></Button>
      </div>
    </nav>
  )
}
