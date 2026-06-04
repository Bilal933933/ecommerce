import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import {
  Button,
  Input,
  Label,
  Field,
  FieldError,
} from "@workspace/ui/index";
import { useResetPassword } from "../hooks/useResetPassword";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "../schemas/reset-password.schema";
import { locales } from "@workspace/locales/index";
import { useAppStore } from "@workspace/store/useAppStore";

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();
  const { language } = useAppStore();
  const t = locales[language].auth;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetPasswordSchema) => {
    if (!token) return;
    resetPassword({ token, newPassword: data.newPassword });
  };

  if (!token) {
    return (
      <div className="text-center space-y-4 py-4">
        <p className="text-sm text-destructive">
          {t.resetPassword.errorMessage}
        </p>
        <Button variant="outline" asChild>
          <Link to="/auth/login">{t.resetPassword.backToLogin}</Link>
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">{t.resetPassword.successMessage}</p>
        <Button asChild>
          <Link to="/auth/login">{t.resetPassword.backToLogin}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field data-invalid={!!errors.newPassword}>
        <Label htmlFor="newPassword">{t.resetPassword.newPassword}</Label>
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="newPassword"
              type="password"
              placeholder={t.resetPassword.newPasswordPlaceholder}
              autoComplete="new-password"
              aria-invalid={!!errors.newPassword}
              disabled={isPending}
            />
          )}
        />
        {errors.newPassword && (
          <FieldError errors={[errors.newPassword]} />
        )}
      </Field>

      <Field data-invalid={!!errors.confirmPassword}>
        <Label htmlFor="confirmPassword">{t.resetPassword.confirmPassword}</Label>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="confirmPassword"
              type="password"
              placeholder={t.resetPassword.confirmPasswordPlaceholder}
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              disabled={isPending}
            />
          )}
        />
        {errors.confirmPassword && (
          <FieldError errors={[errors.confirmPassword]} />
        )}
      </Field>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t.resetPassword.resetting : t.resetPassword.resetButton}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/auth/login" className="text-primary hover:underline">
          {t.resetPassword.backToLogin}
        </Link>
      </p>
    </form>
  );
}
