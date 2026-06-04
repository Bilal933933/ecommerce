import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/index";
import { LoginForm } from "../components/Loginform";
import { locales } from "@workspace/locales/index";
import { useAppStore } from "@workspace/store/useAppStore";
import { SEO } from "@/components/SEO";

export function LoginPage() {
  const { language } = useAppStore();
  const seo = locales[language].seo;
  const t = locales[language].auth;

  return (
    <div className="space-y-6">
      <SEO title={seo.login.title} description={seo.login.description} lang={language} />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">{t.login.appName}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.login.platformSubtitle}</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>{seo.login.title}</CardTitle>
          <CardDescription>
            {t.login.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
