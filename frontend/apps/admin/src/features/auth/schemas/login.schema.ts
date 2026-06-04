import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة"),

  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
