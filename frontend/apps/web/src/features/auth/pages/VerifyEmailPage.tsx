import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/index";
import { VerifyEmailForm } from "../components/VerifyEmailForm";
import { locales } from "@workspace/locales/index";
import { useAppStore } from "@workspace/store/useAppStore";
import { SEO } from "@/components/SEO";

export function VerifyEmailPage() {
  const { language } = useAppStore();
  const seo = locales[language].seo;
  const t = locales[language].auth;

  return (
    <div className="space-y-6">
      <SEO title={seo.verifyEmail.title} description={seo.verifyEmail.description} lang={language} />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">{t.login.appName}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.login.platformSubtitle}</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>{seo.verifyEmail.title}</CardTitle>
          <CardDescription>
            {t.verifyEmail.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm />
        </CardContent>
      </Card>
    </div>
  );
}
