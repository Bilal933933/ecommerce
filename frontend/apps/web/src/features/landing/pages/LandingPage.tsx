import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { SEO } from "@/components/SEO"
import { LandingNavbar } from "../components/Navbar"
import { LandingHero } from "../components/Hero"
import { LandingFeatures } from "../components/Features"
import { LandingCTASection } from "../components/CTASection"
import { LandingFooter } from "../components/Footer"

export function LandingPage() {
  const { language } = useAppStore()
  const t = locales[language].seo

  return (
    <div className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      <SEO title={t.landing.title} description={t.landing.description} ogType="website" lang={language} />
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingCTASection />
      <LandingFooter />
    </div>
  )
}
