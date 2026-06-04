import { Outlet } from "react-router-dom"
import { useAppStore } from "@workspace/store/useAppStore"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { Footer } from "@/components/Footer"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@workspace/ui/components/separator"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

export function MainLayout() {
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
                    <main className="flex-1">
                        <div className="mx-auto w-full max-w-7xl px-6 py-6">
                            <Outlet />
                        </div>
                    </main>
                    <Footer />
                </SidebarInset>
            </TooltipProvider>
        </SidebarProvider>
    )
}
