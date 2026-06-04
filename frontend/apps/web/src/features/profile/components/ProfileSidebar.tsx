import type { ProfileUser } from "@workspace/types"
import { AvatarCard } from "./AvatarCard"

interface ProfileSidebarProps {
  user: ProfileUser
}

export function ProfileSidebar({ user }: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      <AvatarCard user={user} />
    </div>
  )
}

