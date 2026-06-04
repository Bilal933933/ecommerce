import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  Button,
  Input,
  Label,
  Field,
  FieldError,
} from "@workspace/ui/index";
import { useForgotPassword } from "../hooks/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../schemas/forgot-password.schema";
import { locales } from "@workspace/locales/index";
import { useAppStore } from "@workspace/store/useAppStore";

// ─── Component ────────────────────────────────────────────────────────────────

export function ForgotPasswordForm() {
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();
  const { language } = useAppStore();
  const t = locales[language].auth;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    forgotPassword(data);
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-2 py-4">
        <p className="text-sm text-muted-foreground">
          {t.forgotPassword.resetSent}
        </p>
        <p className="text-sm text-muted-foreground">
          {t.forgotPassword.checkEmail}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* البريد الإلكتروني */}
      <Field data-invalid={!!errors.email}>
        <Label htmlFor="email">{t.forgotPassword.email}</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder={t.forgotPassword.emailPlaceholder}
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

      {/* زر الإرسال */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t.forgotPassword.sending : t.forgotPassword.sendResetLink}
      </Button>

      {/* رابط العودة */}
      <p className="text-center text-sm text-muted-foreground">
        {t.forgotPassword.rememberPassword}{" "}
        <Link to="/auth/login" className="text-primary hover:underline">
          {t.forgotPassword.backToLogin}
        </Link>
      </p>
    </form>
  );
}
