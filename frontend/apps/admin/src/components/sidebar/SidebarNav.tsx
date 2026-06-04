import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import { locales } from "@workspace/locales"
import { useAppStore } from "@workspace/store/useAppStore"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import type { NavGroup } from "@/config/navigation"

function getLabel(t: Record<string, unknown>, key: string): string {
  const val = t[key]
  return typeof val === "string" ? val : key
}

interface SidebarNavProps {
  groups: NavGroup[]
}

export function SidebarNav({ groups }: SidebarNavProps) {
  const { pathname } = useLocation()
  const { language } = useAppStore()
  const t = locales[language]?.app || {}

  return (
    <>
      {groups.map((group, idx) => (
        <SidebarGroup key={idx}>
          {group.titleKey && (
            <SidebarGroupLabel>
              {getLabel(t, group.titleKey)}
            </SidebarGroupLabel>
          )}
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
              const label = getLabel(t, item.titleKey)

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
