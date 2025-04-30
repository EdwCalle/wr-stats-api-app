import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) => (value as string).trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  credential: string;
  @Transform(({ value }) => (value as string).trim())
  @IsString()
  @MinLength(8)
  password: string;
}
