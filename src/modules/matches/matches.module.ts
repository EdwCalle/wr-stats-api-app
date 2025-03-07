import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { RankedTierModule } from 'src/modules/ranked-tier/ranked-tier.module';
import { SeasonProfileModule } from '../season-profile/season-profile.module';

@Module({
  imports: [
    RankedTierModule,
    SeasonProfileModule,
    MongooseModule.forFeature([
      {
        name: Match.name,
        schema: MatchSchema,
        collection: 'matches'
      }
    ])
  ],
  controllers: [MatchesController],
  providers: [MatchesService]
})
export class MatchesModule {}
