import { ConflictException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
export class MatchQueryDTO {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }: { value: string | number | Date }) => {
    const date = new Date(value);
    const time =
      date.getHours() +
      date.getMinutes() +
      date.getSeconds() +
      date.getMilliseconds();
    if (time !== 0)
      throw new ConflictException(
        'date must be start at 00:00 am in your localtime'
      );
    date.setUTCHours(0, 0, 0, 0);
    return date;
  })
  date: Date;
}
