import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Field,
  FieldError,
} from "@workspace/ui/index";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginSchema } from "../schemas/login.schema";
import { locales } from "@workspace/locales/index";
import { useAppStore } from "@workspace/store/useAppStore";

// ─── Component ────────────────────────────────────────────────────────────────

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const { language } = useAppStore();
  const t = locales[language].auth;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginSchema) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* البريد الإلكتروني */}
      <Field data-invalid={!!errors.email}>
        <Label htmlFor="email">{t.login.email}</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder={t.login.emailPlaceholder}
              autoComplete="email"
              aria-invalid={!!errors.email}
              disabled={isPending}
            />
          )}
        />
        {errors.email && (
          <FieldError errors={[errors.email]} />
        )}
      </Field>

      {/* كلمة المرور */}
      <Field data-invalid={!!errors.password}>
        <Label htmlFor="password">{t.login.password}</Label>
        <div className="relative">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t.login.passwordPlaceholder}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                disabled={isPending}
                className="ps-10"
              />
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 start-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? t.register.hidePassword : t.register.showPassword}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <FieldError errors={[errors.password]} />
        )}
      </Field>

      {/* نسيت كلمة المرور */}
      <div className="flex justify-start">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          {t.login.forgotPassword}
        </Link>
      </div>

      {/* زر تسجيل الدخول */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t.login.signingIn : t.login.signInButton}
      </Button>

      {/* رابط إنشاء حساب */}
      <p className="text-center text-sm text-muted-foreground">
        {t.login.noAccount}{" "}
        <Link to="/auth/register" className="text-primary hover:underline">
          {t.login.signUp}
        </Link>
      </p>
    </form>
  );
}