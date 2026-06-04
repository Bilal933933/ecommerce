// // src/users/dto/create-user.dto.ts

// import {
//   IsEmail,
//   IsEnum,
//   IsOptional,
//   IsString,
//   MinLength,
//   MaxLength,
//   Matches,
// } from 'class-validator';

// import { Transform } from 'class-transformer';
// import { Role } from 'src/generated/prisma/enums';

// export class CreateUserDto {
//   // ─── Name ─────────────────────────────
//   @Transform(({ value }) => value.trim())
//   @IsString({ message: 'الاسم يجب ان يكون نصا' })
//   @MinLength(3, { message: 'الاسم يجب ألا يقل عن 3 أحرف' })
//   @MaxLength(50, { message: 'الاسم يجب ألا يزيد عن 50 حرف' })
//   name: string;

//   // ─── Email ────────────────────────────
//   @Transform(({ value }) => value.toLowerCase().trim())
//   @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
//   @MaxLength(100, { message: 'البريد الإلكتروني طويل جدا' })
//   email: string;

//   // ─── Password ─────────────────────────
//   @Transform(({ value }) => value.trim())
//   @IsString({ message: 'كلمة المرور يجب أن تكون نصا' })
//   @MinLength(8, { message: 'كلمة المرور يجب ألا تقل عن 8 أحرف' })
//   @MaxLength(100, { message: 'كلمة المرور طويلة جدا' })
//   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
//     message:
//       'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم على الأقل',
//   })
//   password: string;

//   // ─── Role ─────────────────────────────
//   @IsOptional()
//   @IsEnum(Role, { message: 'الدور غير صالح' })
//   role?: Role;
// }
