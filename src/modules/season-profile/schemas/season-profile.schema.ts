import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class SeasonProfile {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'seasons',
    set: (v: string) => new Types.ObjectId(v)
  })
  seasonID: Types.ObjectId;
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'users',
    set: (v: string) => new Types.ObjectId(v)
  })
  userID: Types.ObjectId;
  @Prop({ required: true, type: Number })
  winRate: number;
  @Prop({ required: true, type: Number })
  totalMatches: number;
}

export const SeasonProfileSchema = SchemaFactory.createForClass(SeasonProfile);
SeasonProfileSchema.virtual('matches', {
  ref: 'Match', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'seasonProfileID', // is equal to `foreignField`
  justOne: true
});
SeasonProfileSchema.set('toObject', { virtuals: true });
SeasonProfileSchema.set('toJSON', { virtuals: true });
