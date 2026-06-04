import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { User, Mail, Shield, Calendar } from "lucide-react"

export function ProfilePage() {
  const { language } = useAppStore()
  const t = locales[language].profile
  const locale = language === "ar" ? "ar-EG" : "en-US"

  return (
    <>
      <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center px-6 shrink-0">
        <h1 className="text-xl font-semibold">{t.pageTitle}</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="bg-card border rounded-xl p-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> Name
              </span>
              <span className="text-card-foreground font-medium">Admin</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </span>
              <span className="text-card-foreground">admin@example.com</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" /> Role
              </span>
              <span className="text-card-foreground">ADMIN</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Member Since
              </span>
              <span className="text-card-foreground">
                {new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
