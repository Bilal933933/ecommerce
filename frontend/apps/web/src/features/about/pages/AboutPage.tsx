import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { SEO } from "@/components/SEO"
import { HeroSection } from "../components/HeroSection"
import { MissionSection } from "../components/MissionSection"
import { StatsSection } from "../components/StatsSection"
import { FeaturesSection } from "../components/FeaturesSection"
import { TeamSection } from "../components/TeamSection"
import { ContactSection } from "../components/ContactSection"
import { mockFeatures, mockTeam } from "../service/mockData"

export function AboutPage() {
  const { language } = useAppStore()
  const t = locales[language].seo

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t.about.title} description={t.about.description} lang={language} />
      <HeroSection />
      <MissionSection />
      <StatsSection />
      <FeaturesSection features={mockFeatures} />
      <TeamSection team={mockTeam} />
      <ContactSection />
    </div>
  )
}
