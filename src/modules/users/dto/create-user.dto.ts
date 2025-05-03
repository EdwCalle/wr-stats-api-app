import { IsEmail, IsNotEmpty, IsString, IsTimeZone } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  // @IsNotEmpty()
  // @IsString()
  // @IsOptional()
  // role?: string;
  @IsNotEmpty()
  @IsTimeZone()
  timezone: string;
}
