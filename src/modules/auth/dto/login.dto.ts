import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  //TO DO
  //1. option to send email or username
  //   @Transform(({ value }) => (value as string).trim())
  //   @IsString()
  //   @MinLength(3)
  //   username: string; ❌
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @Transform(({ value }) => (value as string).trim())
  @IsString()
  @MinLength(6)
  password: string;
}
