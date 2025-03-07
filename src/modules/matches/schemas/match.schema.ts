import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type MatchDocument = Match & Document;
@Schema({ _id: false })
export class Range {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'RankedTier',
    set: (v: string) => new Types.ObjectId(v)
  })
  rankedTierID: Types.ObjectId;
  @Prop({ required: true, type: Number })
  divisionLvl: number;
  @Prop({ required: true, type: Number })
  marks: number;
}
@Schema({
  timestamps: true
})
export class Match {
  @Prop({
    unique: true,
    required: true,
    type: Date
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
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'SeasonProfile',
    set: (v: string) => new Types.ObjectId(v)
  })
  seasonProfileID: string;
  @Prop({ required: true, type: Range })
  range: Range;
}
export const MatchSchema = SchemaFactory.createForClass(Match);
