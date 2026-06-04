import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppStore, useAuthStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { authClient, usersClient, getErrorMessage } from "@workspace/api-client"
import { Key, Trash2, AlertTriangle, Loader2, Check, X } from "lucide-react"
import { ChangePasswordModal } from "@/features/profile/components/modals/ChangePasswordModal"
import type { ChangePasswordData } from "@/features/profile/types"

export function AccountSection() {
  const { language } = useAppStore()
  const t = locales[language].settings
  const navigate = useNavigate()
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChangePassword = async (data: ChangePasswordData) => {
    setIsLoading(true)
    setMessage(null)
    try {
      const res = await authClient.changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setMessage({ type: "success", text: res.message ?? t.account.changePassword })
      setPasswordModalOpen(false)
    } catch (e: any) {
      const msg = getErrorMessage(e, t.account.changePasswordError)
      setMessage({ type: "error", text: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    setMessage(null)
    try {
      await usersClient.deleteAccount()
      useAuthStore.getState().logout()
      navigate("/auth/login")
    } catch (e: any) {
      const msg = getErrorMessage(e, t.account.deleteAccountError)
      setMessage({ type: "error", text: msg })
      setShowDeleteConfirm(false)
      setDeleteConfirmText("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          {t.sections.account}
        </h3>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-red-500/10 text-red-600"
          }`}>
            {message.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 border">
            <div>
              <p className="font-medium text-card-foreground">{t.account.changePassword}</p>
              <p className="text-xs text-muted-foreground">{t.account.changePasswordDesc}</p>
            </div>
            <button
              onClick={() => setPasswordModalOpen(true)}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition shrink-0"
            >
              {t.account.changePassword}
            </button>
          </div>

          {showDeleteConfirm ? (
            <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 space-y-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                <div>
                  <p className="font-semibold text-card-foreground text-sm">{t.account.deleteConfirmTitle}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.account.deleteConfirmDesc}</p>
                </div>
              </div>
              <label htmlFor="delete-confirm" className="sr-only">{t.account.deleteConfirmPlaceholder}</label>
              <input
                id="delete-confirm"
                name="deleteConfirm"
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={t.account.deleteConfirmPlaceholder}
                className="w-full px-3 py-2 border border-destructive/30 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText("")
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition text-sm font-medium"
                >
                  {t.actions.cancel}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== t.account.deleteConfirmPlaceholder || isLoading}
                  className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t.account.deleteConfirmButton
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{t.account.dangerZone}</p>
                  <p className="text-xs text-muted-foreground">{t.account.deleteAccountDesc}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-sm font-medium border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition shrink-0"
              >
                <Trash2 className="w-4 h-4 inline ml-1" />
                {t.account.deleteAccount}
              </button>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
        isLoading={isLoading}
      />
    </>
  )
}
