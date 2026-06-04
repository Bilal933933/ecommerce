import { Link } from "react-router-dom"
import { locales } from "@workspace/locales"
import { useAppStore } from "@workspace/store/useAppStore"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { navGroups } from "@/config/navigation"
import { SidebarNav } from "./SidebarNav"
import { SidebarUser } from "./SidebarUser"

function SidebarLogo() {
  const { language } = useAppStore()
  const { state, toggleSidebar } = useSidebar()
  const t = locales[language]?.app || {}
  const collapsed = state === "collapsed"

  return (
    <div className="flex h-14 items-center gap-2 px-3">
      {!collapsed && (
        <Link to="/" className="text-lg font-bold text-foreground truncate flex-1">
          {t.appName}
        </Link>
      )}
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={toggleSidebar}
            tooltip={collapsed ? t.menu : undefined}
            className="size-8"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}

export function AppSidebar() {
  const { language } = useAppStore()

  return (
    <Sidebar collapsible="icon" side={language === "ar" ? "right" : "left"}>
      <SidebarHeader>
        <SidebarLogo />
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav groups={navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  )
}
