import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import type { Feature } from "../types"

interface FeaturesSectionProps {
  features: Feature[]
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  const { language } = useAppStore()
  const t = locales[language].about

  const getText = (key: string) => {
    const keys = key.split(".")
    return (t as any)[keys[0]]?.[keys[1]] ?? key
  }

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-card-foreground mb-3">{t.features.title}</h2>
          <p className="text-muted-foreground">{t.features.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {getText(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {getText(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
