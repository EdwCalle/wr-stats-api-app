import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  //TO DO
  //1. option to send email or username
  //   @Transform(({ value }) => (value as string).trim())
  //   @IsString()
  //   @MinLength(3)
  //   username: string; ❌
  @IsEmail()
  email: string;
  @Transform(({ value }) => (value as string).trim())
  @IsString()
  @MinLength(6)
  password: string;
}
