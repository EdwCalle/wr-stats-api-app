import { Type } from 'class-transformer';
import {
  IsString,
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
