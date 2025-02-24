import { Module } from '@nestjs/common';
import { MatchesModule } from './modules/matches/matches.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RankedTierModule } from './modules/ranked-tier/ranked-tier.module';
import { SeasonProfileModule } from './modules/season-profile/season-profile.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/wr_stats'),
    MatchesModule,
    RankedTierModule,
    SeasonProfileModule
  ]
})
export class AppModule {}
