import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ContactDto {
  @IsString({ message: 'validation.contact.name.string' })
  @MinLength(2, { message: 'validation.contact.name.min_length' })
  @MaxLength(100, { message: 'validation.contact.name.max_length' })
  name: string;

  @IsEmail({}, { message: 'validation.contact.email.invalid' })
  email: string;

  @IsString({ message: 'validation.contact.message.string' })
  @IsNotEmpty({ message: 'validation.contact.message.required' })
  @MinLength(10, { message: 'validation.contact.message.min_length' })
  @MaxLength(2000, { message: 'validation.contact.message.max_length' })
  message: string;
}
