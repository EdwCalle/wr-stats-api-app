import { IsInt, IsMongoId, Max, Min } from 'class-validator';

export class CreateSeasonProfileDto {
  @IsMongoId()
  seasonID: string;
  @IsMongoId()
  userID: string;
  @Min(0)
  @Max(1)
  winRate: number;
  @Min(0)
  @IsInt()
  totalMatches: number;
}
