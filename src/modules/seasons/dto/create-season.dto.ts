import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NormalizeDate } from 'src/utils/transforms/date.transform';

export class CreateSeasonDto {
  @IsNotEmpty()
  @IsString()
  seasonName: string;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value, key }: { value: Date; key: string }) => {
    const date = new Date(value);
    const timezone = 'UTC';
    return NormalizeDate(date, timezone, key).toJSDate();
  })
  startDate: Date;
  @IsOptional()
  @IsDate()
  @Transform(({ value, key }: { value: Date; key: string }) => {
    const date = new Date(value);
    const timezone = 'UTC';
    return NormalizeDate(date, timezone, key).toJSDate();
  })
  finishDate: Date | null;
}
