import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@workspace/ui/index";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useResendVerification } from "../hooks/useResendVerification";
import { locales } from "@workspace/locales/index";
import { useAppStore } from "@workspace/store";

export function VerifyEmailForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { language } = useAppStore();
  const t = locales[language].auth;

  const { mutate: verifyEmail, isPending: isVerifying, isSuccess: isVerified, isError } = useVerifyEmail();
  const { mutate: resend, isPending: isResending } = useResendVerification();

  useEffect(() => {
    if (token) {
      verifyEmail({ token });
    }
  }, [token, verifyEmail]);

  if (isVerified) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">{t.verifyEmail.successMessage}</p>
        <Button asChild>
          <Link to="/auth/login">{t.verifyEmail.goToLogin}</Link>
        </Button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center space-y-4 py-4">
        <p className="text-sm text-destructive">{t.verifyEmail.errorMessage}</p>
        <Button variant="outline" asChild>
          <Link to="/auth/login">{t.verifyEmail.goToLogin}</Link>
        </Button>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">{t.verifyEmail.verifying}</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 py-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </div>
      <p className="text-sm text-muted-foreground">{t.verifyEmail.description}</p>
      <p className="text-xs text-muted-foreground">{t.verifyEmail.checkEmail}</p>
      <Button variant="outline" className="w-full" disabled={isResending} onClick={() => resend()}>
        {isResending ? t.verifyEmail.resending : t.verifyEmail.resendButton}
      </Button>
    </div>
  );
}
