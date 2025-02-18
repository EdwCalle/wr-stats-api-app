import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRankedTierDto {
  @IsString()
  @IsNotEmpty()
  'tierName': string;
  @IsString()
  @IsNotEmpty()
  'tierSeason': string;
  @IsString()
  @IsNotEmpty()
  'tierType': string;
  @IsNumber()
  @IsNotEmpty()
  'minMarks': number;
  @IsNumber()
  @IsNotEmpty()
  'maxMarks': number;
}
