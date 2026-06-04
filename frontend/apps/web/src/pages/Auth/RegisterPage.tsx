import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/index";
import { RegisterForm } from "../../features/auth/components/RegisterForm";
import { locales } from "@workspace/locales/index";
import { useAppStore } from "@workspace/store/useAppStore";

export function RegisterPage() {
  const { language } = useAppStore();
  const t = locales[language].auth;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">{t.login.appName}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.register.subtitle}</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>{t.register.title}</CardTitle>
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
