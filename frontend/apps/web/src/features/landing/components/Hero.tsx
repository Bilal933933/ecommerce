import { Button, Card, CardContent, Badge, Progress } from "@workspace/ui/index"
import { ArrowLeft, Play, Activity, Layout, Code } from "lucide-react"
import { useAppStore, useAuthStore, selectIsAuthenticated } from "@workspace/store"
import { locales } from "@workspace/locales"

export function LandingHero() {
  const { language } = useAppStore()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const t = locales[language].landing

  return (
    <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 transform translate-x-1/2 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10 transform -translate-x-1/3 translate-y-1/4"></div>

      <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-right space-y-8">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
            {t.hero.title}
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button size="lg" className="gap-2 w-full sm:w-auto text-lg h-14 px-8">
              {t.hero.cta}
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto text-lg h-14 px-8">
              <Play className="w-5 h-5" />
              {t.hero.watchDemo}
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-2xl -z-10 rounded-3xl"></div>
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="p-4 border-b border-border/50 flex items-center gap-2 bg-muted/30">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <CardContent className="p-6 space-y-6">
              {isAuthenticated ? (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{t.hero.dashboard}</h3>
                      <p className="text-sm text-muted-foreground">{t.hero.live}</p>
                    </div>
                    <Badge variant="secondary">{t.hero.live}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{t.hero.points}</p>
                      <p className="text-2xl font-bold">12k+</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{t.hero.rank}</p>
                      <p className="text-2xl font-bold">4.9/5</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{t.hero.exams}</p>
                      <p className="text-2xl font-bold">$10k</p>
                    </div>
                  </div>
                  <Progress value={87} className="h-2" />
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/80 border">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">{t.hero.recentExams}</span>
                      </div>
                      <Badge variant="secondary">{t.hero.live}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground text-center py-2">{t.hero.noExams}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{t.hero.sampleExamTitle}</h3>
                      <p className="text-sm text-muted-foreground">{t.hero.completedPercent}</p>
                    </div>
                    <div className="text-3xl font-bold text-primary">v1.0</div>
                  </div>
                  <Progress value={100} className="h-2" />
                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/80 border">
                      <div className="flex items-center gap-3">
                        <Layout className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">{t.hero.topicTraining}</span>
                      </div>
                      <Badge variant="secondary">{t.hero.ongoing}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/80 border">
                      <div className="flex items-center gap-3">
                        <Code className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">{t.hero.leaderboard}</span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">{t.hero.rank1}</Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
