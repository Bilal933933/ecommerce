import { Layout } from "../components/Layout"
import { locales } from "@workspace/locales"
import { useAppStore } from "@workspace/store"
import { Button } from "@workspace/ui/index"
import { useTheme } from "../components/theme-provider"

export function Dashboard() {
  const { language, setLanguage } = useAppStore()
  const { theme, setTheme } = useTheme()
  const t = locales[language].app
  
  return (
    <Layout className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            {t.ready}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t.description}
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card border-2 border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                Theme & Language Controls
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Theme:</span>
                  <span className="font-medium">
                    {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
                  </span>
                </div>
                <Button 
                  variant="default"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="w-full"
                >
                  {t.toggleTheme}
                </Button>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Language:</span>
                  <span className="font-medium">
                    {language === 'ar' ? 'العربية' : 'English'}
                  </span>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                  className="w-full"
                >
                  {t.changeLanguage}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border-2 border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                Status Information
              </h2>
              <div className="space-y-3">
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    {t.status.language}
                  </div>
                  <div className="font-mono text-lg">
                    {language === 'ar' ? 'العربية' : 'English'}
                  </div>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    {t.status.theme}
                  </div>
                  <div className="font-mono text-lg">
                    {theme}
                  </div>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    {t.status.test}
                  </div>
                  <div className="font-mono text-lg">
                    {t.hello}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center py-8 border-t border-border">
          <p className="text-muted-foreground">
            This page demonstrates consistent theme and language application across all pages.
          </p>
        </footer>
      </div>
    </Layout>
  )
}
