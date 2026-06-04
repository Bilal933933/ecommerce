import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { Button } from "@workspace/ui/components/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell } from "lucide-react"

interface PreferencesSectionProps {
  emailNotifications: boolean
  onEmailNotificationsChange: (value: boolean) => void
}

export function PreferencesSection({ emailNotifications, onEmailNotificationsChange }: PreferencesSectionProps) {
  const { language, setLanguage } = useAppStore()
  const t = locales[language].settings

  return (
    <div className="bg-card border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        {t.sections.preferences}
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-muted-foreground">{t.preferences.language}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          >
            {language === "ar" ? "English" : "العربية"}
          </Button>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-muted-foreground">{t.preferences.theme}</span>
          <ModeToggle />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <div>
              <span className="text-card-foreground font-medium">{t.preferences.notifications}</span>
              <p className="text-xs text-muted-foreground">{t.preferences.emailNotificationsDesc}</p>
            </div>
          </div>
          <label htmlFor="email-notifications" className="relative inline-flex items-center cursor-pointer">
            <input
              id="email-notifications"
              name="emailNotifications"
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => onEmailNotificationsChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
        </div>
      </div>
    </div>
  )
}
