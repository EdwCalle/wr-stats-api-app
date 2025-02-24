import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateRankedTierDto } from './dto/create-ranked-tier.dto';
import { UpdateRankedTierDto } from './dto/update-ranked-tier.dto';
import { RankedTier } from './schemas/ranked-tier.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TierType } from './enums/ranked-tier.enum';
@Injectable()
export class RankedTierService {
  constructor(
    @InjectModel(RankedTier.name) private rankedTierModel: Model<RankedTier>
  ) {}
  async create(createRankedTierDto: CreateRankedTierDto) {
    console.log('test', createRankedTierDto);
    console.log('test', typeof createRankedTierDto.tierSeason);

    //TO DO
    //1. validate minMarks and maxMarks must be null if tierType is empty ✅
    //2. validate minmakrs > maxmarks ✅
    const { tierType, minMarks, maxMarks } = createRankedTierDto;
    this.checkMarks(tierType, minMarks, maxMarks);
    return await this.rankedTierModel.create(createRankedTierDto);
  }

  findAll() {
    return this.rankedTierModel.find();
  }

  async findOne(id: string): Promise<RankedTier> {
    const rankedTier = await this.rankedTierModel.findById(id);
    if (!rankedTier)
      throw new NotFoundException(`RankedTier with ID '${id}' not found`);
    return rankedTier;
  }

  async update(id: string, updateRankedTierDto: UpdateRankedTierDto) {
    //TO DO
    // In database revalidate onRange aggregation in Matches ❌
    //1. checkMarks if tiertyoe, minmarks, and maxMarks change ✅

    const oldRankedTier = await this.findOne(id);
    let { tierType, minMarks, maxMarks } = oldRankedTier;
    const {
      tierType: newTierType,
      minMarks: newMinMarks,
      maxMarks: newMaxMarks
    } = updateRankedTierDto;

    tierType = newTierType !== undefined ? newTierType : tierType;
    minMarks = newMinMarks !== undefined ? newMinMarks : minMarks;
    maxMarks = newMaxMarks !== undefined ? newMaxMarks : maxMarks;

    this.checkMarks(tierType as TierType, minMarks, maxMarks);
    return await this.rankedTierModel.findByIdAndUpdate(
      id,
      updateRankedTierDto
    );
  }
  async remove(id: string) {
    //TO DO
    // 1. check if exist rankedTier ✅
    // 2. check if rankedtier is referenced key ✅
    await this.findOne(id);
    await this.checkConstraintKey(id);
    return await this.rankedTierModel.findByIdAndDelete(id);
  }
  //VALIDATIONS
  private checkMarks(tierType: TierType, minMarks: number, maxMarks: number) {
    if (tierType === TierType.EMPTY && (minMarks !== 0 || maxMarks !== 0)) {
      throw new ConflictException(
        "When tierType is 'empty', minMarks and maxMarks must be zero"
      );
    }
    if (tierType !== TierType.EMPTY && maxMarks <= minMarks) {
      throw new ConflictException(
        `maxMarks must be greater then minMarks,your min:${minMarks} your max:${maxMarks}`
      );
    }
  }
  //Referenced Local key as FK
  private async checkConstraintKey(id: string) {
    const rankedTiers: any[] = await this.rankedTierModel
      .aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            as: 'matchesfk',
            from: 'matches',
            foreignField: 'range.rankedTierID',
            localField: '_id'
          }
        }
      ])
      .exec();
    //TO DO
    //fix any in aggregate ❌
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (rankedTiers[0].matchesfk.length > 0)
      throw new ConflictException(`This rankedTier ${id} is already in use`);
  }
  //
}
