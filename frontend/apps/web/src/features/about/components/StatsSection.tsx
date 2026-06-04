import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { Users, CheckCircle2, BookOpen, Layers } from "lucide-react"

export function StatsSection() {
  const { language } = useAppStore()
  const t = locales[language].about

  const items = [
    { icon: <Users className="w-8 h-8" />, value: "١٠٬٠٠٠+", labelKey: "stats.activeUsers" },
    { icon: <CheckCircle2 className="w-8 h-8" />, value: "٥٠٠+", labelKey: "stats.completedExams" },
    { icon: <BookOpen className="w-8 h-8" />, value: "٢٬٠٠٠+", labelKey: "stats.questionsBank" },
    { icon: <Layers className="w-8 h-8" />, value: "٨+", labelKey: "stats.specializations" },
  ]

  const getLabel = (labelKey: string) => {
    const keys = labelKey.split(".")
    return (t as any)[keys[0]]?.[keys[1]] ?? labelKey
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-card-foreground mb-3">{t.stats.title}</h2>
          <p className="text-muted-foreground">{t.stats.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                {item.icon}
              </div>
              <div className="text-3xl font-bold text-card-foreground">{item.value}</div>
              <div className="text-muted-foreground mt-1">{getLabel(item.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
