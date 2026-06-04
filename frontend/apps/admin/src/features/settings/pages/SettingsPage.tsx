import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { User, Bell, Shield } from "lucide-react"

export function SettingsPage() {
  const { language } = useAppStore()
  const t = locales[language].settings

  return (
    <>
      <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center px-6 shrink-0">
        <h1 className="text-xl font-semibold">{t.pageTitle}</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {t.sections.profile}
            </h3>
            <p className="text-muted-foreground text-sm">Profile settings content</p>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              {t.sections.preferences}
            </h3>
            <p className="text-muted-foreground text-sm">Preferences settings content</p>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              {t.sections.account}
            </h3>
            <p className="text-muted-foreground text-sm">Account settings content</p>
          </div>
        </div>
      </div>
    </>
  )
}
