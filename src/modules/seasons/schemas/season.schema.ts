import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Season {
  @Prop({ required: true, type: String })
  seasonName: string;
  @Prop({ required: true, type: Date })
  startDate: Date;
  @Prop({ type: Date, default: null })
  finishDate: Date;
}
export const SeasonSchema = SchemaFactory.createForClass(Season);
SeasonSchema.virtual('seasonProfile', {
  ref: 'SeasonProfile', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'seasonID', // is equal to `foreignField`
  justOne: true
});
SeasonSchema.set('toObject', { virtuals: true });
//SeasonSchema.set('toJSON', { virtuals: true });
