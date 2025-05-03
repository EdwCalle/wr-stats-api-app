import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsTimeZone,
  MinLength
} from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => (value as string).trim())
  @IsString()
  @MinLength(3)
  username: string;
  @IsEmail()
  email: string;

  @Transform(({ value }) => (value as string).trim())
  @IsString()
  @MinLength(6)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  password: string;
  @IsNotEmpty()
  @IsTimeZone()
  timezone: string;
}
