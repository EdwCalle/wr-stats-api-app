import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class RankedRange {
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
  @Prop({ required: true, type: RankedRange })
  rankedRange: RankedRange;
}
export const MatchSchema = SchemaFactory.createForClass(Match);
