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
    type: Number
  })
  minMarks: number;
  @Prop({
    required: true,
    type: Number
  })
  maxMarks: number;
}
export const RankedTierSchema = SchemaFactory.createForClass(RankedTier);
