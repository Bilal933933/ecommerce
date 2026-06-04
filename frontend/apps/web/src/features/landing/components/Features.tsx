import { Card } from "@workspace/ui/index"
import { Target, Layers, Layout, Globe, Lock, Workflow } from "lucide-react"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"

function getFeatures(t: typeof locales.ar.landing.features | typeof locales.en.landing.features) {
  return [
    { icon: Layers, title: t.mockExams, description: t.mockExamsDesc },
    { icon: Layout, title: t.topicTraining, description: t.topicTrainingDesc },
    { icon: Globe, title: t.performance, description: t.performanceDesc },
    { icon: Lock, title: t.leaderboard, description: t.leaderboardDesc },
    { icon: Workflow, title: t.progress, description: t.progressDesc },
    { icon: Target, title: t.multiSubject, description: t.multiSubjectDesc },
  ]
}

export function LandingFeatures() {
  const { language } = useAppStore()
  const t = locales[language].landing
  const features = getFeatures(t.features)

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-bold">{t.features.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.features.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <Card key={f.title} className="p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group border">
                <div className="mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <h3 className="mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
