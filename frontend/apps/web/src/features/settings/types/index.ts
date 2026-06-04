export interface UserProfile {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  createdAt: string
}

export interface NotificationPreferences {
  emailNotifications: boolean
}
