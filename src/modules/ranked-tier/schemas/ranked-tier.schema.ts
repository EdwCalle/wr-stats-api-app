import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true
})
export class RankedTier {
  @Prop({
    required: true,
    type: String
  })
  tierName: string;
  @Prop({
    required: true,
    type: String
  })
  tierSeason: string;
  @Prop({
    required: true,
    type: String
  })
  tierType: string;
  @Prop({
    required: true,
    type: Number,
    min: 0
  })
  minMarks: number;
  @Prop({
    required: true,
    type: Number,
    min: 0
  })
  maxMarks: number;
}
export const RankedTierSchema = SchemaFactory.createForClass(RankedTier);

RankedTierSchema.virtual('matches', {
  ref: 'Match', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'range.rankedTierID', // is equal to `foreignField`
  justOne: true
});
RankedTierSchema.set('toObject', { virtuals: true });
// RankedTierSchema.set('toJSON', { virtuals: true });
