import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsTimeZone } from 'class-validator';
import { NormalizeDate } from 'src/utils/transforms/date.transform';
export class FilterDateMatchDTO {
  @IsNotEmpty()
  @IsTimeZone()
  timezone: string;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value, obj }: { value: Date; obj: FilterDateMatchDTO }) => {
    const date = new Date(value);
    const timezone = obj.timezone;
    return NormalizeDate(date, timezone).toJSDate();
  })
  date: Date;
}
