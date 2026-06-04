export interface VerifyEmailTemplateData {
  name: string;
  verifyUrl: string;
}

export function verifyEmailTemplate(data: VerifyEmailTemplateData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
      <h2 style="color: #1a1a2e;">مرحباً ${data.name}،</h2>
      <p>شكراً لتسجيلك في منصة البيان. يرجى تأكيد بريدك الإلكتروني بالضغط على الزر أدناه:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.verifyUrl}"
           style="background-color: #4f46e5; color: white; padding: 12px 32px;
                  text-decoration: none; border-radius: 8px; font-size: 16px;">
          تأكيد البريد الإلكتروني
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        الرابط صالح لمدة 24 ساعة. إذا لم تقم بالتسجيل، يمكنك تجاهل هذا البريد.
      </p>
    </div>
  `;
}
