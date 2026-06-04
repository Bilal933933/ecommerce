import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"

export function HeroSection() {
  const { language } = useAppStore()
  const t = locales[language].about

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
      </div>
      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            {t.hero.subtitle}
          </p>
          <p className="text-lg text-blue-50 leading-relaxed">
            {t.hero.description}
          </p>
        </div>
      </div>
    </section>
  )
}
