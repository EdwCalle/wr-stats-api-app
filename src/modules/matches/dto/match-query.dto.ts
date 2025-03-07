import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
export class MatchQueryDTO {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }: { value: string | number | Date }) => {
    const date = new Date(value);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  })
  date: Date;
}
