import { useState, useEffect } from "react"
import { X, Mail, Loader2, Check } from "lucide-react"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"

interface VerifyEmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => Promise<void> | void
  email: string
  isLoading: boolean
}

export function VerifyEmailModal({
  isOpen,
  onClose,
  onSubmit,
  email,
  isLoading,
}: VerifyEmailModalProps) {
  const { language } = useAppStore()
  const t = locales[language].profile.actions.modals.verifyEmail
  const tClose = locales[language].profile.actions.modals.close
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsSent(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async () => {
    await onSubmit()
    setIsSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            {t.title}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition" aria-label={tClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-center">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {isSent ? (
              <Check className="w-8 h-8 text-emerald-600" />
            ) : (
              <Mail className="w-8 h-8 text-primary" />
            )}
          </div>

          {isSent ? (
            <>
              <p className="text-foreground mb-2 font-medium">{t.sentTitle}</p>
              <p className="text-sm text-muted-foreground">
                {t.sentDescription}
              </p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-2">{t.description}</p>
              <p className="font-semibold mb-4" dir="ltr">{email}</p>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.submitting}
                  </>
                ) : (
                  t.submit
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
