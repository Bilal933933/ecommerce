import { locales } from "@workspace/locales"
import { useAppStore } from "@workspace/store"

export function About() {
  const { language } = useAppStore()
  const t = locales[language].app

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          {t.aboutTitle}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.aboutDescription}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
            {t.missionTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t.missionDescription}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
            {t.visionTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t.visionDescription}
          </p>
        </div>
      </section>
    </div>
  )
}
