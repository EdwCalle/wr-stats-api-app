import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class Range {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'rankedTiers',
    set: (v: string) => new Types.ObjectId(v)
  })
  rankedTierID: Types.ObjectId;
  @Prop({ required: true, type: Number })
  divisionLvl: number;
  @Prop({ required: true, type: Number })
  marks: number;
}
@Schema({
  timestamps: true,
  versionKey: false
})
export class Match {
  @Prop({
    unique: true,
    required: true,
    type: Date,
    set: (v: Date) => v.setUTCHours(0, 0, 0, 0)
  })
  date: Date;
  @Prop({
    required: true,
    type: Number
  })
  victories: number;
  @Prop({
    required: true,
    type: Number
  })
  defeats: number;
  @Prop({ required: true, type: String })
  seasonProfileID: string;
  @Prop({ required: true, type: Range })
  range: Range;
}
export const MatchSchema = SchemaFactory.createForClass(Match);
