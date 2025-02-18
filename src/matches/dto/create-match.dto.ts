import { Type } from 'class-transformer';
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

export class RankedRangeDto {
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
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  victories: number;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  defeats: number;
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  seasonProfileID: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RankedRangeDto)
  rankedRange: RankedRangeDto;
}
