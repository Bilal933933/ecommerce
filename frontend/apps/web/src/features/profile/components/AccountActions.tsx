import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { Key, UserPen, ShieldCheck, LogOut, ChevronLeft, ChevronRight, Check, X } from "lucide-react"
import { useProfileActions } from "../hooks/useProfileActions"
import { ChangePasswordModal } from "./modals/ChangePasswordModal"
import { EditProfileModal } from "./modals/EditProfileModal"
import { VerifyEmailModal } from "./modals/VerifyEmailModal"
import { ConfirmLogoutAllModal } from "./modals/ConfirmLogoutAllModal"
import type { ProfileUser } from "../types"

type ModalKey = "password" | "profile" | "verify" | "logoutAll" | null

interface AccountActionsProps {
  user: ProfileUser
}

export function AccountActions({ user }: AccountActionsProps) {
  const { language } = useAppStore()
  const t = locales[language].profile
  const queryClient = useQueryClient()
  const [activeModal, setActiveModal] = useState<ModalKey>(null)
  const {
    isLoading,
    error,
    success,
    changePassword,
    updateProfile,
    sendVerificationEmail,
    logoutAllDevices,
    clearMessages,
  } = useProfileActions(t.actions)

  const ArrowIcon = language === "ar" ? ChevronLeft : ChevronRight

  const handleChangePassword = async (data: any) => {
    const result = await changePassword(data)
    if (result.success) {
      setActiveModal(null)
    }
  }

  const handleUpdateProfile = async (data: any) => {
    const result = await updateProfile(data)
    if (result.success) {
      setActiveModal(null)
    }
  }

  const handleVerifyEmail = async () => {
    await sendVerificationEmail()
  }

  const handleLogoutAll = async () => {
    const result = await logoutAllDevices()
    if (result.success) {
      setActiveModal(null)
      queryClient.invalidateQueries({ queryKey: ["users", "me", "profile"] })
    }
  }

  const actions = [
    {
      key: "password" as ModalKey,
      icon: Key,
      label: t.actions.changePassword,
      desc: t.actions.desc.changePassword,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      show: true,
    },
    {
      key: "profile" as ModalKey,
      icon: UserPen,
      label: t.actions.editProfile,
      desc: t.actions.desc.editProfile,
      color: "text-green-600",
      bg: "bg-green-500/10",
      show: true,
    },
    {
      key: "verify" as ModalKey,
      icon: ShieldCheck,
      label: t.actions.verifyEmail,
      desc: t.actions.desc.verifyEmail,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      show: !user.isEmailVerified,
    },
    {
      key: "logoutAll" as ModalKey,
      icon: LogOut,
      label: t.actions.logoutAll,
      desc: t.actions.desc.logoutAll,
      color: "text-red-600",
      bg: "bg-red-500/10",
      danger: true,
      show: true,
    },
  ]

  return (
    <>
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          {t.actions.title}
        </h3>

        <div className="space-y-2">
          {actions
            .filter((a) => a.show)
            .map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.key}
                  onClick={() => {
                    clearMessages()
                    setActiveModal(action.key)
                  }}
                  className={`w-full text-right px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                    action.danger
                      ? "bg-red-500/5 hover:bg-red-500/15"
                      : "bg-muted/30 hover:bg-muted/60"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <div className="flex-1 min-w-0 text-start">
                    <span className="block text-sm font-medium">{action.label}</span>
                    <span className="block text-xs text-muted-foreground">{action.desc}</span>
                  </div>
                  <ArrowIcon className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )
            })}
        </div>

        {success && (
          <div className="mt-4 p-3 bg-emerald-500/10 text-emerald-600 rounded-lg text-sm flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <ChangePasswordModal
        isOpen={activeModal === "password"}
        onClose={() => {
          setActiveModal(null)
          clearMessages()
        }}
        onSubmit={handleChangePassword}
        isLoading={isLoading}
      />

      <EditProfileModal
        isOpen={activeModal === "profile"}
        onClose={() => {
          setActiveModal(null)
          clearMessages()
        }}
        onSubmit={handleUpdateProfile}
        user={user}
        isLoading={isLoading}
      />

      <VerifyEmailModal
        isOpen={activeModal === "verify"}
        onClose={() => {
          setActiveModal(null)
          clearMessages()
        }}
        onSubmit={handleVerifyEmail}
        email={user.email}
        isLoading={isLoading}
      />

      <ConfirmLogoutAllModal
        isOpen={activeModal === "logoutAll"}
        onClose={() => {
          setActiveModal(null)
          clearMessages()
        }}
        onConfirm={handleLogoutAll}
        isLoading={isLoading}
      />
    </>
  )
}
