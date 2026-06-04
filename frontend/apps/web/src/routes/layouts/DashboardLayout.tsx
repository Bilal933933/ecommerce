import { Outlet } from "react-router-dom"
import { useAppStore } from "@workspace/store/useAppStore"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardLayout() {
  const { language } = useAppStore()

  return (
    <SidebarProvider dir={language === "ar" ? "rtl" : "ltr"}>
      <TooltipProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-sm px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="md:mr-auto h-6" />
            <div className="flex-1" />
            <ModeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  )
}
