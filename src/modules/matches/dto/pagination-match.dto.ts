import { Type } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';

export class PaginationMatchDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(1000)
  limit: number = 10;
}
