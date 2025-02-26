import { Module } from '@nestjs/common';
import { SeasonProfileService } from './season-profile.service';
import { SeasonProfileController } from './season-profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SeasonProfile,
  SeasonProfileSchema
} from './schemas/season-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SeasonProfile.name,
        schema: SeasonProfileSchema,
        collection: 'seasonProfile'
      }
    ])
  ],
  controllers: [SeasonProfileController],
  providers: [SeasonProfileService]
})
export class SeasonProfileModule {}
