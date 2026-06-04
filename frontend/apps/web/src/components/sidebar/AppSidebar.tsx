import { Link } from "react-router-dom"
import { Trophy } from "lucide-react"
import { locales } from "@workspace/locales"
import { useAppStore } from "@workspace/store/useAppStore"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { navGroups } from "@/config/navigation"
import { SidebarNav } from "./SidebarNav"
import { SidebarUser } from "./SidebarUser"

export function AppSidebar() {
  const { language } = useAppStore()
  const t = locales[language]?.app || {}

  return (
    <Sidebar collapsible="icon" side={language === "ar" ? "right" : "left"}>
      <SidebarHeader>
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-3 px-3 py-2 group-data-[collapsible=icon]:justify-center"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Trophy className="size-4" />
          </div>
          <span className="truncate font-bold text-xl group-data-[collapsible=icon]:hidden">
            {t.appName}
          </span>
        </Link>
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
