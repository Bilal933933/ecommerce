import { useState, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { authClient, usersClient } from "@workspace/api-client"
import type { ChangePasswordData, EditProfileData, ProfileActionResult } from "../types"

type ProfileActionsT = {
  errors: {
    passwordMismatch: string
    passwordTooShort: string
    passwordSameAsOld: string
    nameTooShort: string
    emailInvalid: string
    changePassword: string
    updateProfile: string
    sendVerification: string
    logoutAll: string
  }
  success: {
    passwordChanged: string
    profileUpdated: string
    verificationSent: string
    loggedOutFrom: (count: number) => string
  }
}

export function useProfileActions(t: ProfileActionsT) {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const reset = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const changePassword = useCallback(
    async (data: ChangePasswordData): Promise<ProfileActionResult> => {
      reset()
      if (data.newPassword !== data.confirmPassword) {
        setError(t.errors.passwordMismatch)
        return { success: false, message: t.errors.passwordMismatch }
      }
      if (data.newPassword.length < 8) {
        setError(t.errors.passwordTooShort)
        return { success: false, message: t.errors.passwordTooShort }
      }
      if (data.currentPassword === data.newPassword) {
        setError(t.errors.passwordSameAsOld)
        return { success: false, message: t.errors.passwordSameAsOld }
      }

      setIsLoading(true)
      try {
        const res = await authClient.changePassword({
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
        const msg = res.message ?? t.success.passwordChanged
        setSuccess(msg)
        return { success: true, message: msg }
      } catch (e: any) {
        const msg = e?.response?.data?.message ?? t.errors.changePassword
        setError(msg)
        return { success: false, message: msg }
      } finally {
        setIsLoading(false)
      }
    },
    [t, reset],
  )

  const updateProfile = useCallback(
    async (data: EditProfileData): Promise<ProfileActionResult> => {
      reset()
      if (!data.name || data.name.trim().length < 2) {
        setError(t.errors.nameTooShort)
        return { success: false, message: t.errors.nameTooShort }
      }
      if (!data.email || !data.email.trim()) {
        setError(t.errors.emailInvalid)
        return { success: false, message: t.errors.emailInvalid }
      }

      setIsLoading(true)
      try {
        const result = await usersClient.updateMe({
          name: data.name.trim(),
          email: data.email.trim(),
          deviceName: data.deviceName?.trim() || null,
          phone: data.phone?.trim() || null,
          bio: data.bio?.trim() || null,
          gender: data.gender ?? null,
          birthDate: data.birthDate || null,
        })
        await queryClient.invalidateQueries({ queryKey: ["users", "me", "profile"] })
        setSuccess(t.success.profileUpdated)
        return {
          success: true,
          message: t.success.profileUpdated,
          emailChanged: result.emailChanged,
        }
      } catch (e: any) {
        const msg = e?.response?.data?.message ?? t.errors.updateProfile
        setError(msg)
        return { success: false, message: msg }
      } finally {
        setIsLoading(false)
      }
    },
    [t, queryClient, reset],
  )

  const sendVerificationEmail = useCallback(async (): Promise<ProfileActionResult> => {
    reset()
    setIsLoading(true)
    try {
      const res = await authClient.resendVerification()
      const msg = res.message ?? t.success.verificationSent
      setSuccess(msg)
      return { success: true, message: msg }
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? t.errors.sendVerification
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setIsLoading(false)
    }
  }, [t, reset])

  const logoutAllDevices = useCallback(async (): Promise<ProfileActionResult> => {
    reset()
    setIsLoading(true)
    try {
      const res = await authClient.logoutAll()
      await queryClient.invalidateQueries({ queryKey: ["users", "me", "profile"] })
      const msg = t.success.loggedOutFrom(res.revokedCount)
      setSuccess(msg)
      return { success: true, message: msg }
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? t.errors.logoutAll
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setIsLoading(false)
    }
  }, [t, queryClient, reset])

  return {
    isLoading,
    error,
    success,
    changePassword,
    updateProfile,
    sendVerificationEmail,
    logoutAllDevices,
    clearMessages: reset,
  }
}
