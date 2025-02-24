import { Module } from '@nestjs/common';
import { SeasonProfileService } from './season-profile.service';
import { SeasonProfileController } from './season-profile.controller';

@Module({
  controllers: [SeasonProfileController],
  providers: [SeasonProfileService]
})
export class SeasonProfileModule {}
