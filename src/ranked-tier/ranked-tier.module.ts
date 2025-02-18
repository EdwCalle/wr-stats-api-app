import { Module } from '@nestjs/common';
import { RankedTierService } from './ranked-tier.service';
import { RankedTierController } from './ranked-tier.controller';
import { RankedTier, RankedTierSchema } from './schemas/ranked-tier.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RankedTier.name,
        schema: RankedTierSchema,
        collection: 'rankedTiers',
      },
    ]),
  ],
  controllers: [RankedTierController],
  providers: [RankedTierService],
  exports: [RankedTierService],
})
export class RankedTierModule {}
