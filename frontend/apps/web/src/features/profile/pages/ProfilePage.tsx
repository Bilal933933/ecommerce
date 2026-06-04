import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { SEO } from "@/components/SEO"
import {
  ProfileLayout,
  ProfileSidebar,
  SessionsList,
  AccountActions,
} from "../components"
import { useMyProfile } from "../hooks/useMyProfile"

export function ProfilePage() {
  const { language } = useAppStore()
  const t = locales[language].profile
  const seo = locales[language].seo

  const { data, isLoading, isError } = useMyProfile()

  if (isLoading) {
    return (
      <>
        <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center px-6 shrink-0">
          <h1 className="text-xl font-semibold">{t.pageTitle}</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="space-y-6">
            <div className="h-64 bg-muted rounded-lg animate-pulse" />
            <div className="h-28 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </>
    )
  }

  if (isError || !data) {
    return (
      <>
        <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center px-6 shrink-0">
          <h1 className="text-xl font-semibold">{t.pageTitle}</h1>
        </header>
        <div className="flex-1 flex items-center justify-center p-6 text-muted-foreground">
          {"تعذّر تحميل البيانات"}
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title={seo.profile.title} description={seo.profile.description} lang={language} />
      <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center px-6 shrink-0">
        <h1 className="text-xl font-semibold">{t.pageTitle}</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <ProfileLayout
          sidebar={
            <ProfileSidebar user={data.user} />
          }
          main={
            <>
              <SessionsList sessions={data.activeSessions} />
              <AccountActions user={data.user} />
            </>
          }
        />
      </div>
    </>
  )
}
