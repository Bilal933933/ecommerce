import { useNavigate } from "react-router-dom"
import { LogOut, User, Settings as SettingsIcon } from "lucide-react"
import { useAuthStore, selectUser } from "@workspace/store"
import { useAppStore } from "@workspace/store/useAppStore"
import { locales } from "@workspace/locales"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function SidebarUser() {
  const user = useAuthStore(selectUser)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const { language } = useAppStore()
  const t = locales[language]?.app || {}

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name || ""} className="rounded-lg" />}
                <AvatarFallback className="rounded-lg text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">{user?.name || t.guest}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align={language === "ar" ? "start" : "end"}
            className="min-w-48 rounded-xl"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/profile" className="flex items-center gap-2">
                <User size={16} />
                {t.profile || "Profile"}
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/settings" className="flex items-center gap-2">
                <SettingsIcon size={16} />
                {t.settings || "Settings"}
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                logout()
                navigate("/auth/login")
              }}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              {t.logout || "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
