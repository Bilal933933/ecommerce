import { Link } from "react-router-dom"
import { useAppStore, useAuthStore, selectIsAuthenticated } from "@workspace/store"
import { locales } from "@workspace/locales"
import { Button } from "@workspace/ui/index"
import { Package, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/index"
import { ModeToggle } from "@/components/mode-toggle"

export function LandingNavbar() {
  const { language, setLanguage } = useAppStore()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const t = locales[language].app
  const tLanding = locales[language].landing

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="font-bold text-xl">{t.appName}</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-primary">{t.home}</Link>
            <a href="#specializations" className="text-muted-foreground hover:text-primary transition-colors">{tLanding.navbar.specializations}</a>
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">{tLanding.navbar.features}</a>
            <a href="#leaderboard" className="text-muted-foreground hover:text-primary transition-colors">{tLanding.navbar.leaderboard}</a>
          </nav>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "ar" ? "en" : "ar")} className="text-muted-foreground hover:text-foreground hidden md:inline-flex">
              {language === "ar" ? "English" : "العربية"}
            </Button>
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">{tLanding.navbar.dashboard}</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth/login">{t.login}</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/auth/register">{t.register}</Link>
                  </Button>
                </>
              )}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <Link to="/" className="text-lg font-medium text-primary">{t.home}</Link>
                  <a href="#specializations" className="text-lg font-medium text-muted-foreground">{tLanding.navbar.specializations}</a>
                  <a href="#features" className="text-lg font-medium text-muted-foreground">{tLanding.navbar.features}</a>
                  <a href="#leaderboard" className="text-lg font-medium text-muted-foreground">{tLanding.navbar.leaderboard}</a>
                  <hr className="my-2" />
                  <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "ar" ? "en" : "ar")} className="justify-start">
                    {language === "ar" ? "English" : "العربية"}
                  </Button>
                  {isAuthenticated ? (
                    <Link to="/dashboard" className="w-full">
                      <Button className="w-full justify-center">{tLanding.navbar.dashboard}</Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/auth/login" className="w-full">
                        <Button variant="outline" className="w-full justify-center">{t.login}</Button>
                      </Link>
                      <Link to="/auth/register" className="w-full">
                        <Button className="w-full justify-center">{t.register}</Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
