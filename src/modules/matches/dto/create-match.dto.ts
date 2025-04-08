import { ConflictException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsNumber,
  IsNotEmpty,
  IsObject,
  Min,
  ValidateNested,
  IsMongoId
} from 'class-validator';

export class RangeDto {
  @IsNotEmpty()
  @IsMongoId()
  rankedTierID: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  divisionLvl: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  marks: number;
}

export class CreateMatchDto {
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
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  victories: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  defeats: number;
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  seasonProfileID: string;
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => RangeDto)
  range: RangeDto;
}
