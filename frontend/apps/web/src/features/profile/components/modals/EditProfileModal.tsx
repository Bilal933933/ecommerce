import { useState, useRef, useEffect } from "react"
import { X, UserPen, Loader2, Camera, Trash2, Mail } from "lucide-react"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import type { EditProfileData, ProfileUser } from "../../types"
import { useProfileAvatar } from "../../hooks/useProfileAvatar"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EditProfileData) => Promise<void> | void
  user: ProfileUser
  isLoading: boolean
}

export function EditProfileModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
}: EditProfileModalProps) {
  const { language } = useAppStore()
  const t = locales[language].profile.actions.modals.editProfile
  const tClose = locales[language].profile.actions.modals.close
  const tErrors = locales[language].profile.actions.errors
  const [formData, setFormData] = useState<EditProfileData>({
    name: user.name ?? "",
    email: user.email,
    deviceName: user.deviceName ?? null,
    phone: user.phone ?? null,
    bio: user.bio ?? null,
    gender: user.gender ?? null,
    birthDate: user.birthDate ? user.birthDate.split("T")[0] : null,
  })
  const [error, setError] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatar = useProfileAvatar()

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name ?? "",
        email: user.email,
        deviceName: user.deviceName ?? null,
        phone: user.phone ?? null,
        bio: user.bio ?? null,
        gender: user.gender ?? null,
        birthDate: user.birthDate ? user.birthDate.split("T")[0] : null,
      })
      setAvatarPreview(user.avatarUrl)
      setError(null)
      avatar.resetState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user])

  if (!isOpen) return null

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)

    const result = await avatar.uploadAvatar(file)
    if (result.success && result.avatarUrl) {
      setAvatarPreview(result.avatarUrl)
    } else {
      // revert preview on failure
      setAvatarPreview(user.avatarUrl)
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
    URL.revokeObjectURL(previewUrl)
  }

  const handleRemoveAvatar = async () => {
    const result = await avatar.removeAvatar()
    if (result.success) {
      setAvatarPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError(tErrors.nameTooShort)
      return
    }
    if (!formData.email.trim()) {
      setError(tErrors.emailInvalid)
      return
    }
    await onSubmit({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      bio: formData.bio?.trim() || null,
    })
  }

  const handleClose = () => {
    setFormData({
      name: user.name ?? "",
      email: user.email,
      deviceName: user.deviceName ?? null,
      phone: user.phone ?? null,
      bio: user.bio ?? null,
      gender: user.gender ?? null,
      birthDate: user.birthDate ? user.birthDate.split("T")[0] : null,
    })
    setAvatarPreview(user.avatarUrl)
    setError(null)
    avatar.resetState()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-card z-10">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserPen className="w-5 h-5 text-primary" />
            {t.title}
          </h3>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition" aria-label={tClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* ─── صورة البروفايل ─── */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={user.name ?? "Avatar"}
                  className="w-24 h-24 rounded-full object-cover border-4 border-muted"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/15 text-primary flex items-center justify-center text-2xl font-semibold border-4 border-muted">
                  {(formData.name || user.email).charAt(0).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatar.isUploading || isLoading}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full hover:bg-primary/90 transition disabled:opacity-50"
                aria-label={t.changeAvatar}
              >
                {avatar.isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarSelect}
                className="hidden"
                disabled={avatar.isUploading || isLoading}
              />
            </div>
            {avatar.isUploading && (
              <div className="w-full max-w-[200px]">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${avatar.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {t.uploadingAvatar.replace("{progress}", String(avatar.progress))}
                </p>
              </div>
            )}
            {avatarPreview && !avatar.isUploading && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={isLoading}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" />
                {t.removeAvatar}
              </button>
            )}
            {avatar.error && (
              <p className="text-xs text-red-600">{avatar.error}</p>
            )}
          </div>

          {/* ─── الاسم الكامل ─── */}
          <div>
            <label htmlFor="edit-full-name" className="block text-sm font-medium mb-1">{t.fullName}</label>
            <input
              id="edit-full-name"
              name="fullName"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
              placeholder={t.fullNamePlaceholder}
            />
          </div>

          {/* ─── البريد الإلكتروني ─── */}
          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {t.email}
            </label>
            <input
              id="edit-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground mt-1">{t.emailHelp}</p>
          </div>

          {/* ─── رقم الهاتف ─── */}
          <div>
            <label htmlFor="edit-phone" className="block text-sm font-medium mb-1">{t.phone}</label>
            <input
              id="edit-phone"
              name="phone"
              type="tel"
              value={formData.phone ?? ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value || null })}
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
              placeholder={t.phonePlaceholder}
              dir="ltr"
            />
          </div>

          {/* ─── الجنس ─── */}
          <div>
            <label className="block text-sm font-medium mb-1">{t.gender}</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: "MALE" })}
                disabled={isLoading}
                className={`px-3 py-2 text-sm rounded-lg border transition ${
                  formData.gender === "MALE"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {t.genderMale}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                disabled={isLoading}
                className={`px-3 py-2 text-sm rounded-lg border transition ${
                  formData.gender === "FEMALE"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {t.genderFemale}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: null })}
                disabled={isLoading}
                className={`px-3 py-2 text-sm rounded-lg border transition ${
                  formData.gender === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {t.genderPreferNotToSay}
              </button>
            </div>
          </div>

          {/* ─── تاريخ الميلاد ─── */}
          <div>
            <label htmlFor="edit-birth-date" className="block text-sm font-medium mb-1">{t.birthDate}</label>
            <input
              id="edit-birth-date"
              name="birthDate"
              type="date"
              value={formData.birthDate ?? ""}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value || null })}
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
              dir="ltr"
            />
          </div>

          {/* ─── نبذة عنك ─── */}
          <div>
            <label htmlFor="edit-bio" className="block text-sm font-medium mb-1">{t.bio}</label>
            <textarea
              id="edit-bio"
              name="bio"
              value={formData.bio ?? ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value || null })}
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={isLoading}
              placeholder={t.bioPlaceholder}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">{t.bioHelp}</p>
          </div>

          {/* ─── اسم الجهاز ─── */}
          <div>
            <label htmlFor="edit-device-name" className="block text-sm font-medium mb-1">{t.deviceName}</label>
            <input
              id="edit-device-name"
              name="deviceName"
              type="text"
              value={formData.deviceName ?? ""}
              onChange={(e) => setFormData({ ...formData, deviceName: e.target.value || null })}
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
              placeholder={t.deviceNamePlaceholder}
            />
            <p className="text-xs text-muted-foreground mt-1">{t.deviceNameHelp}</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition text-sm font-medium"
              disabled={isLoading || avatar.isUploading}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading || avatar.isUploading}
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
