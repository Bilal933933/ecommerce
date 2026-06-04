import { Shield } from "lucide-react"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import type { ProfileActiveSession } from "@workspace/types"
import { SessionItem } from "./SessionItem"
import { LoadingSkeleton } from "./LoadingSkeleton"

interface SessionsListProps {
  sessions: ProfileActiveSession[]
  loading?: boolean
}

export function SessionsList({ sessions, loading = false }: SessionsListProps) {
  const { language } = useAppStore()
  const t = locales[language].profile

  if (loading) return <LoadingSkeleton />

  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          {t.sessions.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{t.sessions.description}</p>
      </div>
      {sessions.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          {t.sessions.empty}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {sessions.map((session) => (
            <SessionItem key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}
