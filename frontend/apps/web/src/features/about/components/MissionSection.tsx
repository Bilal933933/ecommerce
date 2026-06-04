import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { Eye, Target } from "lucide-react"

export function MissionSection() {
  const { language } = useAppStore()
  const t = locales[language].about

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="text-center md:text-right">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-4">
              <Eye className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3">{t.vision.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{t.vision.description}</p>
          </div>
          <div className="text-center md:text-right">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-4">
              <Target className="w-8 h-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3">{t.mission.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{t.mission.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
