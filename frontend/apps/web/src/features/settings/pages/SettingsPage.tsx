import { useState, useEffect } from "react"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { SEO } from "@/components/SEO"
import { ProfileSection } from "../components/ProfileSection"
import { PreferencesSection } from "../components/PreferencesSection"
import { AccountSection } from "../components/AccountSection"
import { settingsService } from "../service/settingsService"
import type { ProfileResponse } from "@workspace/types"

export function SettingsPage() {
  const { language } = useAppStore()
  const t = locales[language].settings
  const seo = locales[language].seo
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [emailNotifications, setEmailNotifications] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await settingsService.getProfile()
        setProfile(data)
        setEmailNotifications(true) // Default value - can be updated from backend
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <>
        <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center px-6 shrink-0">
          <h1 className="text-xl font-semibold">{t.pageTitle}</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
          <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-48 bg-muted rounded-xl animate-pulse" />
          <div className="h-56 bg-muted rounded-xl animate-pulse" />
          <div className="h-40 bg-muted rounded-xl animate-pulse" />
        </div>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center px-6 shrink-0">
          <h1 className="text-xl font-semibold">{t.pageTitle}</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="text-center text-muted-foreground">
            {"No data available"}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title={seo.settings.title} description={seo.settings.description} lang={language} />
      <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center px-6 shrink-0">
        <h1 className="text-xl font-semibold">{t.pageTitle}</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <ProfileSection user={profile.user} />
          <PreferencesSection
            emailNotifications={emailNotifications}
            onEmailNotificationsChange={setEmailNotifications}
          />
          <AccountSection />
        </div>
      </div>
    </>
  )
}
