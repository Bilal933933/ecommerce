import type { UserProfile, NotificationPreferences } from "../types"

export const mockUserProfile: UserProfile = {
  id: "user-123",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  role: "USER",
  createdAt: "2025-01-15T00:00:00.000Z",
}

export const mockNotificationPrefs: NotificationPreferences = {
  emailNotifications: true,
}
