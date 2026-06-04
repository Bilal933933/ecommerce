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
import { useRegister } from "../hooks/useRegister";
import { registerSchema, type RegisterSchema } from "../schemas/register.schema";
import { locales } from "@workspace/locales/index";
import { useAppStore } from "@workspace/store/useAppStore";

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterForm() {
  const { language } = useAppStore()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: register, isPending } = useRegister();
  const t = locales[language].auth

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = ({ confirmPassword: _, ...data }: RegisterSchema) => {
    register(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* الاسم */}
      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.name}>
          <Label htmlFor="name">{t.register.name}</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                type="text"
                placeholder={t.register.namePlaceholder}
                autoComplete="given-name"
                aria-invalid={!!errors.name}
                disabled={isPending}
              />
            )}
          />
          {errors.name && (
            <FieldError errors={[errors.name]} />
          )}
        </Field>

      </div>

      {/* البريد الإلكتروني */}
      <Field data-invalid={!!errors.email}>
        <Label htmlFor="email">{t.register.email}</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder={t.register.emailPlaceholder}
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
        <Label htmlFor="password">{t.register.password}</Label>
        <div className="relative">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t.register.passwordPlaceholder}
                autoComplete="new-password"
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

      {/* تأكيد كلمة المرور */}
      <Field data-invalid={!!errors.confirmPassword}>
        <Label htmlFor="confirmPassword">{t.register.confirmPassword}</Label>
        <div className="relative">
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t.register.confirmPasswordPlaceholder}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                disabled={isPending}
                className="ps-10"
              />
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 start-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirmPassword ? t.register.hidePassword : t.register.showPassword}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <FieldError errors={[errors.confirmPassword]} />
        )}
      </Field>

      {/* زر إنشاء الحساب */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t.register.creatingAccount : t.register.signUpButton}
      </Button>

      {/* رابط تسجيل الدخول */}
      <p className="text-center text-sm text-muted-foreground">
        {t.register.hasAccount}{" "}
        <Link to="/auth/login" className="text-primary hover:underline">
          {t.register.signIn}
        </Link>
      </p>
    </form>
  );
}