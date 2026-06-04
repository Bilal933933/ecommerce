import { Outlet } from "react-router-dom"
import { useAppStore } from "@workspace/store/useAppStore"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export function MainLayout() {
    const { language } = useAppStore()

    return (
        <div className="flex flex-col min-h-svh bg-background text-foreground transition-colors duration-300" dir={language === "ar" ? "rtl" : "ltr"}>
            <Header />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
