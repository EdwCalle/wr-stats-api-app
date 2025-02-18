import { Module } from '@nestjs/common';
import { MatchesModule } from './matches/matches.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RankedTierModule } from './ranked-tier/ranked-tier.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/wr_stats'),
    MatchesModule,
    RankedTierModule
  ]
})
export class AppModule {}
