import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/index";
import { ForgotPasswordForm } from "../../features/auth/components/ForgotPasswordForm";
import { locales } from "@workspace/locales/index";
import { useAppStore } from "@workspace/store/useAppStore";

export function ForgotPasswordPage() {
  const { language } = useAppStore();
  const t = locales[language].auth;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">{t.login.appName}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.login.platformSubtitle}</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>{t.forgotPassword.title}</CardTitle>
          <CardDescription>
            {t.forgotPassword.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
