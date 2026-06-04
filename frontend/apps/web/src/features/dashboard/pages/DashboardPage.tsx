import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { SEO } from "@/components/SEO"
import { DashboardNavbar } from "../components/Navbar"
import { DashboardWelcomeSection } from "../components/WelcomeSection"

export function DashboardPage() {
  const { language } = useAppStore()
  const t = locales[language].seo

  return (
    <>
      <SEO title={t.dashboard.title} description={t.dashboard.description} lang={language} />
      <DashboardNavbar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
          <DashboardWelcomeSection />
        </div>
      </div>
    </>
  )
}
