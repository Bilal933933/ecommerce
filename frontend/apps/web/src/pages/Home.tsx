  import { locales } from "@workspace/locales"
  import { useAppStore, useAuthStore } from "@workspace/store"
  import { Button } from "@workspace/ui/index"
  import { useTheme } from "../components/theme-provider"
  import { selectUser } from "@workspace/store"
  import { ModeToggle } from "@/components/mode-toggle"

  export function Home() {
    const { language, setLanguage } = useAppStore()
    const user = useAuthStore(selectUser);
    const { theme, setTheme } = useTheme()
    const t = locales[language].app

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8">
          <header className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              {t.hello} {user ? user.name : t.guest}!
            </h1>
            <p className="text-lg text-muted-foreground">
              {t.welcome}
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                {t.status.language}
              </h3>
              <p className="text-muted-foreground mb-4">
                Current: {language === 'ar' ? 'العربية' : 'English'}
              </p>
              <Button
                variant="outline"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="w-full"
              >
                {t.changeLanguage}
              </Button>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                {t.status.theme}
              </h3>
              <p className="text-muted-foreground mb-4">
                Current: {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="flex-1 rounded-full"
                >
                  {t.toggleTheme}
                </Button>
                <ModeToggle />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                {t.status.test}
              </h3>
              <p className="text-muted-foreground mb-4">
                Translation test
              </p>
              <div className="text-center">
                <span className="text-2xl">{t.hello}</span>
              </div>
            </div>
          </section>
        </div>
    )
  }
