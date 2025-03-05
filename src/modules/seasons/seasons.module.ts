import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { SeasonsController } from './seasons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Season, SeasonSchema } from './schemas/season.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Season.name,
        schema: SeasonSchema,
        collection: 'seasons'
      }
    ])
  ],
  controllers: [SeasonsController],
  providers: [SeasonsService],
  exports: [SeasonsService]
})
export class SeasonsModule {}
