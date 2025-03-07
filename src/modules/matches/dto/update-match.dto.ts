import { CreateMatchDto } from './create-match.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateMatchDto extends PartialType(
  OmitType(CreateMatchDto, ['date'] as const)
) {}
