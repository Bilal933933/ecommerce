import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/index";
import { RegisterForm } from "../components/RegisterForm";
import { locales } from "@workspace/locales/index";
import { useAppStore } from "@workspace/store/useAppStore";
import { SEO } from "@/components/SEO";

export function RegisterPage() {
  const { language } = useAppStore();
  const seo = locales[language].seo;
  const t = locales[language].auth;

  return (
    <div className="space-y-6">
      <SEO title={seo.register.title} description={seo.register.description} lang={language} />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">{t.login.appName}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.register.subtitle}</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>{seo.register.title}</CardTitle>
          <CardDescription>
            {t.register.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
