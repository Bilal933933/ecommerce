import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  User,
  Settings,
  Info,
} from "lucide-react"

export interface NavItem {
  titleKey: string
  url: string
  icon: LucideIcon
}

export interface NavGroup {
  titleKey?: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    titleKey: "mainMenu",
    items: [
      { titleKey: "home", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    titleKey: "tools",
    items: [
      { titleKey: "profile", url: "/profile", icon: User },
      { titleKey: "settings", url: "/settings", icon: Settings },
    ],
  },
  {
    titleKey: "more",
    items: [
      { titleKey: "about", url: "/about", icon: Info },
    ],
  },
]
