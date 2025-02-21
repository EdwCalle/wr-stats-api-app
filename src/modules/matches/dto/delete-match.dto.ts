import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class DeleteMatchDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
