export interface ResetPasswordTemplateData {
  name: string;
  resetUrl: string;
}

export function resetPasswordTemplate(data: ResetPasswordTemplateData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
      <h2 style="color: #1a1a2e;">مرحباً ${data.name}،</h2>
      <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. اضغط على الزر أدناه للمتابعة:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.resetUrl}"
           style="background-color: #dc2626; color: white; padding: 12px 32px;
                  text-decoration: none; border-radius: 8px; font-size: 16px;">
          إعادة تعيين كلمة المرور
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        الرابط صالح لمدة ساعة واحدة فقط. إذا لم تطلب ذلك، يمكنك تجاهل هذا البريد.
      </p>
    </div>
  `;
}
