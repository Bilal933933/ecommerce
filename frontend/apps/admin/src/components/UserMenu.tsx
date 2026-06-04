import { Link, useNavigate } from "react-router-dom"
import { LogOut, User, Settings } from "lucide-react"
import { useAuthStore, selectUser } from "@workspace/store"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import { Button } from "@workspace/ui/components/button"
import { useAppStore } from "@workspace/store/useAppStore"
import { locales } from "@workspace/locales"

export function UserMenu() {
  const user = useAuthStore(selectUser)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const { language } = useAppStore()
  const t = locales[language].app

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-9">
            <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={language === "ar" ? "start" : "end"}
        className="min-w-48"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1 max-w-40">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2">
            <User size={16} />
            {t.profile || "Profile"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2">
            <Settings size={16} />
            {t.settings || "Settings"}
          </Link>
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
  )
}
// import {
//   CreditCardIcon,
//   LogOutIcon,
//   SettingsIcon,
//   UserIcon,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export function DropdownMenuIcons() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline">Open</Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuItem>
//           <UserIcon />
//           Profile
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <CreditCardIcon />
//           Billing
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <SettingsIcon />
//           Settings
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem variant="destructive">
//           <LogOutIcon />
//           Log out
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
