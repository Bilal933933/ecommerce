import { useState, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { usersClient } from "@workspace/api-client"
import { locales } from "@workspace/locales"
import { useAppStore } from "@workspace/store"

interface UseProfileAvatarReturn {
  isUploading: boolean
  progress: number
  error: string | null
  success: string | null
  uploadAvatar: (file: File) => Promise<{ success: boolean; avatarUrl?: string; message: string }>
  removeAvatar: () => Promise<{ success: boolean; message: string }>
  resetState: () => void
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function useProfileAvatar(): UseProfileAvatarReturn {
  const { language } = useAppStore()
  const t = locales[language].profile.actions
  const queryClient = useQueryClient()
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const resetState = useCallback(() => {
    setError(null)
    setSuccess(null)
    setProgress(0)
  }, [])

  const uploadAvatar = useCallback(
    async (file: File) => {
      resetState()

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        const msg = t.errors.avatarTypeNotAllowed
        setError(msg)
        return { success: false, message: msg }
      }
      if (file.size > MAX_SIZE) {
        const msg = t.errors.avatarSizeExceeded
        setError(msg)
        return { success: false, message: msg }
      }

      setIsUploading(true)
      try {
        // 1) طلب Signed URL
        const { signedUrl, uploadSessionId, publicId } = await usersClient.getSignedUrl({
          type: "IMAGE",
          mimeType: file.type,
          size: file.size,
        })

        // 2) رفع مباشر لـ Cloudinary مع تتبع التقدم
        const { url } = await usersClient.uploadToCloudinary(
          signedUrl,
          file,
          (percent) => setProgress(percent),
        )

        // 3) تأكيد الرفع وربط المالك
        const confirmed = await usersClient.confirmUpload({
          url,
          publicId,
          uploadSessionId,
          type: "IMAGE",
          size: file.size,
          mimeType: file.type,
        })

        // 4) تعيين الصورة كأفاتار
        const result = await usersClient.setAvatar({ fileId: confirmed.id })

        await queryClient.invalidateQueries({ queryKey: ["users", "me", "profile"] })

        const msg = t.success.avatarUpdated
        setSuccess(msg)
        return { success: true, avatarUrl: result.avatarUrl, message: msg }
      } catch (e: any) {
        const msg = e?.response?.data?.message ?? t.errors.avatarUploadFailed
        setError(msg)
        return { success: false, message: msg }
      } finally {
        setIsUploading(false)
      }
    },
    [t, queryClient, resetState],
  )

  const removeAvatar = useCallback(async () => {
    resetState()
    try {
      await usersClient.removeAvatar()
      await queryClient.invalidateQueries({ queryKey: ["users", "me", "profile"] })
      const msg = t.success.avatarRemoved
      setSuccess(msg)
      return { success: true, message: msg }
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? t.errors.avatarRemoveFailed
      setError(msg)
      return { success: false, message: msg }
    }
  }, [t, queryClient, resetState])

  return {
    isUploading,
    progress,
    error,
    success,
    uploadAvatar,
    removeAvatar,
    resetState,
  }
}
