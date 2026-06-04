import { Link } from "react-router-dom"
import { useState } from "react"
import { useAppStore } from "@workspace/store/useAppStore"
import { useAuthStore, selectIsAuthenticated } from "@workspace/store"
import { useTheme } from "./theme-provider"
import { locales } from "@workspace/locales"
import { Button } from "@workspace/ui/index"
import { ModeToggle } from "./mode-toggle"
import { UserMenu } from "./UserMenu"

export function Header() {
  const { language, setLanguage } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const t = locales[language].app || {}

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              {t.appName}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t.home}
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t.about}
            </Link>
          </nav>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="text-muted-foreground hover:text-foreground"
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-full text-sm font-medium transition-all border border-border hover:border-foreground/20 hover:bg-muted/50 h-9 flex items-center"
                >
                  {t.login}
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/95 active:scale-[0.98] transition-all shadow-sm h-9 flex items-center"
                >
                  {t.register}
                </Link>
              </div>
            )}

            <ModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground p-2"
              aria-label={t.menu}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Language & Theme */}
              <div className="space-y-2 pb-2 border-b border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                  className="w-full justify-start"
                >
                  {language === 'ar' ? 'English' : 'العربية'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="w-full justify-start"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </Button>
              </div>

              {/* Mobile Navigation Links */}
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.home}
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.about}
              </Link>
              {/* Mobile Auth / User */}
              <div className="pt-4 pb-2 border-t border-border">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t.profile || "Profile"}
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-right px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      {t.logout || "Logout"}
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      className="block px-3 py-2 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t.login}
                    </Link>
                    <Link
                      to="/auth/register"
                      className="block w-full mt-2 px-3 py-2 rounded-xl text-base font-medium bg-primary text-primary-foreground hover:bg-primary/95 text-center transition-colors shadow-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t.register}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
