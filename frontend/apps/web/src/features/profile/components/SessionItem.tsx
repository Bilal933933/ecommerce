import { Globe, Fingerprint, Calendar, ShieldCheck } from "lucide-react"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import type { ProfileActiveSession } from "@workspace/types"

interface SessionItemProps {
  session: ProfileActiveSession
}

function getDeviceEmoji(userAgent: string | null): string {
  if (!userAgent) return "💻"
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "📱"
  if (userAgent.includes("Android")) return "🤖"
  return "💻"
}

export function SessionItem({ session }: SessionItemProps) {
  const { language } = useAppStore()
  const t = locales[language].profile

  const formatDate = (dateString: string) => {
    const locale = language === "ar" ? "ar-EG" : "en-US"
    return new Date(dateString).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })
  }

  const details = [
    { icon: Globe, label: t.sessions.ipLabel, value: session.ipAddress ?? "—" },
    { icon: Fingerprint, label: t.sessions.userAgentLabel, value: session.userAgent ?? "—" },
    { icon: Calendar, label: t.sessions.loggedInAt, value: formatDate(session.createdAt) },
    { icon: ShieldCheck, label: t.sessions.expiresAt, value: formatDate(session.expiresAt) },
  ]

  return (
    <div className="p-4 transition hover:bg-muted/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
          {getDeviceEmoji(session.userAgent)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-sm font-medium text-card-foreground">
              {session.userAgent ?? t.sessions.unknownDevice}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {details.map((d, idx) => {
              const Icon = d.icon
              return (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="w-3 h-3 shrink-0" />
                  <span className="truncate">{d.label} {d.value}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
