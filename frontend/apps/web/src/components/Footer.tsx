import { useAppStore } from "@workspace/store/useAppStore"
import { locales } from "@workspace/locales"

export function Footer() {
    const { language } = useAppStore()
    const t = locales[language].app
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-muted/30 mt-auto">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">{t.appName}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-foreground">{t.home}</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    {t.home}
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    {t.about}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-foreground">{t.login}</h4>
                        <p className="text-muted-foreground text-sm">
                            &copy; {currentYear} {t.appName}
                        </p>
                        <a href="https://github.com/ahmed-fawzy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                            GitHub
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="text-muted-foreground text-sm">
                        &copy; {currentYear} {t.appName}
                    </p>
                </div>
            </div>
        </footer>
    )
}
