import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { User, Mail, Shield, Calendar } from "lucide-react"
import type { ProfileUser } from "@workspace/types"

interface ProfileSectionProps {
  user: ProfileUser
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const { language } = useAppStore()
  const t = locales[language].settings
  const locale = language === "ar" ? "ar-EG" : "en-US"

  return (
    <div className="bg-card border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        {t.sections.profile}
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4" /> {t.profile.name}
          </span>
          <span className="text-card-foreground font-medium">{user.name}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground flex items-center gap-2">
            <Mail className="w-4 h-4" /> {t.profile.email}
          </span>
          <span className="text-card-foreground">{user.email}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground flex items-center gap-2">
            <Shield className="w-4 h-4" /> {t.profile.role}
          </span>
          <span className="text-card-foreground">{user.role === "ADMIN" ? "Admin" : "User"}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {t.profile.memberSince}
          </span>
          <span className="text-card-foreground">
            {new Date(user.createdAt).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  )
}
