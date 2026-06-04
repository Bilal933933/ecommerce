import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { Separator } from "@workspace/ui/index"
import { Trophy, Globe, MessageCircle, Play } from "lucide-react"

export function LandingFooter() {
  const { language } = useAppStore()
  const t = locales[language].app
  const tLanding = locales[language].landing

  return (
    <footer className="border-t bg-muted/20 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Trophy className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="font-bold text-xl">{t.appName}</span>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">{tLanding.footer.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{tLanding.footer.quickLinks}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t.home}</a></li>
              <li><a href="#specializations" className="hover:text-primary transition-colors">{tLanding.navbar.specializations}</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">{tLanding.navbar.features}</a></li>
              <li><a href="#leaderboard" className="hover:text-primary transition-colors">{tLanding.navbar.leaderboard}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{tLanding.footer.followUs}</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Play className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <Separator className="mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t.appName}. {tLanding.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
