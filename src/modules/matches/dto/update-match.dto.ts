import { Type } from 'class-transformer';
import { CreateMatchDto } from './create-match.dto';
import { IsDate, IsNotEmpty } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateMatchDto extends PartialType(
  OmitType(CreateMatchDto, ['date'] as const)
) {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
