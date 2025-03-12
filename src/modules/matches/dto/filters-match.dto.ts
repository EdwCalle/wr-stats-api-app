import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
//TO DO
// (global) add no sql injection ❌
// make validation transform reusable  ❌
export class FiltersMatchDto {
  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    try {
      return new Types.ObjectId(value);
    } catch {
      throw new BadRequestException(
        'from filter Match season profile: invalid mongo id'
      );
    }
  })
  seasonProfileID?: Types.ObjectId;
}
