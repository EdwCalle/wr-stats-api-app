import { IsEnum, IsIn, IsNotEmpty, IsString, Min } from 'class-validator';
import { TierSeason, TierType } from '../enums/ranked-tier.enum';

export class CreateRankedTierDto {
  @IsString()
  @IsNotEmpty()
  tierName: string;
  @IsNotEmpty()
  // @IsEnum(TierSeason)
  @IsIn([TierSeason.CUSTOM])
  tierSeason: TierSeason;
  @IsNotEmpty()
  @IsEnum(TierType)
  tierType: TierType;
  @Min(0)
  minMarks: number;
  @Min(0)
  maxMarks: number;
}
