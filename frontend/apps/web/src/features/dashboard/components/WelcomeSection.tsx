import { useAppStore, useAuthStore, selectUser } from "@workspace/store"
import { locales } from "@workspace/locales"

export function DashboardWelcomeSection() {
  const { language } = useAppStore()
  const t = locales[language].dashboard
  const user = useAuthStore(selectUser)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t.welcome.greeting} {user?.name || t.welcome.guest} 👋</h1>
        <p className="text-muted-foreground">{t.welcome.continueJourney}</p>
      </div>
    </div>
  )
}
