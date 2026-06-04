import { create } from "zustand"
import { persist } from "zustand/middleware"

type AppStore = {
  theme: "light" | "dark" | "system"
  language: "ar" | "en"
  toggleTheme: () => void
  setLanguage: (language: "ar" | "en") => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: "light",
      language: "ar",

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light"
        })),

      setLanguage: (language) =>
        set({
          language
        })
    }),
    {
      name: "app-store"
    }
  )
)