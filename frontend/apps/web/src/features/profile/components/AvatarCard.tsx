import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/index"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { BadgeCheck, Clock, ShieldCheck, Mail, Monitor, History, Calendar } from "lucide-react"
import type { ProfileUser } from "@workspace/types"

interface AvatarCardProps {
  user: ProfileUser
}

export function AvatarCard({ user }: AvatarCardProps) {
  const { language } = useAppStore()
  const t = locales[language].profile

  const displayName = user.name ?? user.email.split("@")[0]
  const initial = displayName.charAt(0).toUpperCase()

  const formatDate = (dateString: string) => {
    const locale = language === "ar" ? "ar-EG" : "en-US"
    return new Date(dateString).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const locale = language === "ar" ? "ar-EG" : "en-US"
    return new Date(dateString).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
  }

  const infoRows = [
    { icon: Mail, label: t.userInfo.email, value: user.email },
    ...(user.deviceName ? [{ icon: Monitor, label: t.userInfo.currentDevice, value: user.deviceName }] : []),
    ...(user.lastLoginAt
      ? [{ icon: History, label: t.userInfo.lastLogin, value: `${formatDate(user.lastLoginAt)} - ${formatTime(user.lastLoginAt)}` }]
      : []),
    { icon: Calendar, label: t.userInfo.joinDate, value: formatDate(user.createdAt) },
  ]

  return (
    <div className="bg-card border rounded-2xl overflow-hidden shadow-xs hover:shadow-xs transition-all duration-300">
      {/* Banner */}
      <div className="h-32 bg-linear-to-r from-primary/80 to-primary" />
      
      <div className="px-6 pb-6 -mt-16 flex flex-col md:flex-row md:items-end gap-6 border-b">
        {/* Avatar */}
        <div className="relative inline-block mx-auto md:mx-0 shrink-0">
          <div className="rounded-full p-1.5 bg-background shadow-md">
            <Avatar className="size-32 ring-4 ring-primary/10">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={displayName} />
              <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">{initial}</AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center shadow-xs">
            <BadgeCheck className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* User Info Details */}
        <div className="text-center md:text-start flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-card-foreground truncate">{displayName}</h2>
          <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-1.5 mt-1">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">
              {user.role === "ADMIN" ? t.avatar.roleAdmin : t.avatar.roleUser}
            </span>
          </p>

          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            {user.isEmailVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 text-xs rounded-full font-medium">
                <BadgeCheck className="w-3.5 h-3.5" />
                {t.avatar.verified}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-600 text-xs rounded-full font-medium">
                <Clock className="w-3.5 h-3.5" />
                {t.avatar.unverified}
              </span>
            )}
            {user.isActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 text-xs rounded-full font-medium">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                {t.avatar.active}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-600 text-xs rounded-full font-medium">
                <span className="w-2 h-2 bg-red-600 rounded-full" />
                {t.avatar.inactive}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info List */}
      <div className="p-6 bg-muted/10">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          {t.userInfo.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {infoRows.map((row, idx) => {
            const Icon = row.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border hover:bg-muted/40 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{row.label}</p>
                  <p className="text-sm font-semibold text-card-foreground truncate mt-0.5">{row.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

