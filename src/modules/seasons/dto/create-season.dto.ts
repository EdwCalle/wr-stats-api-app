import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSeasonDto {
  @IsNotEmpty()
  @IsString()
  seasonName: string;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  finishDate: Date | null;
}
