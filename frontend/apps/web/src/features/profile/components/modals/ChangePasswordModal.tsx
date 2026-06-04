import { useState } from "react"
import { X, KeyRound, Loader2 } from "lucide-react"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import type { ChangePasswordData } from "../../types"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ChangePasswordData) => Promise<void> | void
  isLoading: boolean
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ChangePasswordModalProps) {
  const { language } = useAppStore()
  const t = locales[language].profile.actions.modals.changePassword
  const tClose = locales[language].profile.actions.modals.close
  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordData, string>>>({})

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ChangePasswordData, string>> = {}
    if (!formData.currentPassword) newErrors.currentPassword = t.currentPasswordRequired
    if (!formData.newPassword) newErrors.newPassword = t.newPasswordRequired
    else if (formData.newPassword.length < 8) newErrors.newPassword = t.minLength
    if (!formData.confirmPassword) newErrors.confirmPassword = t.confirmRequired
    else if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = t.passwordsDoNotMatch
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    await onSubmit(formData)
    if (!isLoading) {
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    }
  }

  const handleClose = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setErrors({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            {t.title}
          </h3>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition" aria-label={tClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="change-current-password" className="block text-sm font-medium mb-1">{t.currentPassword}</label>
            <input
              id="change-current-password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.currentPassword ? "border-red-500" : ""}`}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
          </div>

          <div>
            <label htmlFor="change-new-password" className="block text-sm font-medium mb-1">{t.newPassword}</label>
            <input
              id="change-new-password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.newPassword ? "border-red-500" : ""}`}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
          </div>

          <div>
            <label htmlFor="change-confirm-password" className="block text-sm font-medium mb-1">{t.confirmPassword}</label>
            <input
              id="change-confirm-password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.confirmPassword ? "border-red-500" : ""}`}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition text-sm font-medium"
              disabled={isLoading}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
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
          </div>
        </form>
      </div>
    </div>
  )
}
