import { X, AlertTriangle, LogOut, Loader2 } from "lucide-react"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"

interface ConfirmLogoutAllModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  isLoading: boolean
}

export function ConfirmLogoutAllModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmLogoutAllModalProps) {
  const { language } = useAppStore()
  const t = locales[language].profile.actions.modals.logoutAll
  const tClose = locales[language].profile.actions.modals.close

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            {t.title}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition" aria-label={tClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-foreground mb-2">{t.confirmTitle}</p>
            <p className="text-sm text-muted-foreground">
              {t.confirmDescription}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition text-sm font-medium"
              disabled={isLoading}
            >
              {t.cancel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                t.confirm
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
