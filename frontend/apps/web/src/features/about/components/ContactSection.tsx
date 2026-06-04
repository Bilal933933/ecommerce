import { useState } from "react"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"
import { contactClient, getErrorMessage } from "@workspace/api-client"
import { Mail, Phone, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export function ContactSection() {
  const { language } = useAppStore()
  const t = locales[language].about
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)
    try {
      await contactClient.send(formData)
      setStatus({ type: "success", text: t.contact.sendSuccess })
      setFormData({ name: "", email: "", message: "" })
    } catch (err: any) {
      const msg = getErrorMessage(err, "حدث خطأ أثناء الإرسال")
      setStatus({ type: "error", text: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (status) setStatus(null)
  }

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{t.contact.title}</h2>
              <p className="text-blue-100 mb-6">{t.contact.subtitle}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>{t.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>{t.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>{t.contact.address}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">{t.contact.formTitle}</h3>
              {status && (
                <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
                  status.type === "success" ? "bg-emerald-500/20 text-emerald-100" : "bg-red-500/20 text-red-100"
                }`}>
                  {status.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{status.text}</span>
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="contact-name" className="sr-only">{t.contact.namePlaceholder}</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder={t.contact.namePlaceholder}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">{t.contact.emailPlaceholder}</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={t.contact.emailPlaceholder}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">{t.contact.messagePlaceholder}</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder={t.contact.messagePlaceholder}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    t.contact.sendButton
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
