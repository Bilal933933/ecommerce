import { Button, Card } from "@workspace/ui/index"
import { ArrowLeft, Sparkles } from "lucide-react"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"

export function LandingCTASection() {
  const { language } = useAppStore()
  const t = locales[language].landing

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 lg:px-8">
        <Card className="max-w-4xl mx-auto p-12 lg:p-16 text-center border-2 shadow-2xl border-border/50">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t.cta.badge}</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">{t.cta.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 gap-2">
              {t.cta.signUp}<ArrowLeft className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">{t.cta.login}</Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
