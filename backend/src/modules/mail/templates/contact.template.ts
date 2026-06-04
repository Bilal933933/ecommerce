export const contactTemplate = (data: {
  name: string;
  email: string;
  message: string;
}): string => `
<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8" />
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <table style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden;">
    <tr>
      <td style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📬 رسالة جديدة من الموقع</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        <table style="width: 100%;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <strong style="color: #374151;">الاسم:</strong>
              <span style="color: #6b7280; margin-right: 8px;">${data.name}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <strong style="color: #374151;">البريد الإلكتروني:</strong>
              <span style="color: #6b7280; margin-right: 8px;">${data.email}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <strong style="color: #374151;">الرسالة:</strong>
              <p style="color: #6b7280; margin-top: 8px; line-height: 1.6;">${data.message}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
