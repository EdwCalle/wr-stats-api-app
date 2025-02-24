import { PartialType } from '@nestjs/mapped-types';
import { CreateSeasonProfileDto } from './create-season-profile.dto';

export class UpdateSeasonProfileDto extends PartialType(CreateSeasonProfileDto) {}
