import { PartialType } from '@nestjs/mapped-types';
import { CreateRankedTierDto } from './create-ranked-tier.dto';

export class UpdateRankedTierDto extends PartialType(CreateRankedTierDto) {}
