import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateRankedTierDto } from './dto/create-ranked-tier.dto';
import { UpdateRankedTierDto } from './dto/update-ranked-tier.dto';
import { RankedTier } from './schemas/ranked-tier.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TierType } from './enums/ranked-tier.enum';
import { isOutRange } from 'src/utils/validators/data.validator';
@Injectable()
export class RankedTierService {
  constructor(
    @InjectModel(RankedTier.name) private rankedTierModel: Model<RankedTier>
  ) {}
  async create(createRankedTierDto: CreateRankedTierDto) {
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
      throw new NotFoundException(`No RankedTier with ID '${id}' found`);
    return rankedTier;
  }

  async update(id: string, updateRankedTierDto: UpdateRankedTierDto) {
    //TO DO
    // In (database) revalidate onRange aggregation in Matches ❌
    //1. checkMarks if tiertype, minmarks, and maxMarks change ✅
    // optimize check constraint and findOne ❌

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
    await this.checkConstraintKey(id);
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
  //Local Validations
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
    //TO DO
    // fix any problem ❌
    const rankedTier: any = await this.rankedTierModel
      .findById(id)
      .populate('matches')
      .exec();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (rankedTier.matches)
      throw new ConflictException('SeasonProfile already in use');
  }
  // custom fk validation from matchs
  checkRange(divisionLvl: number, marks: number, rankedTier: RankedTier) {
    if (rankedTier.tierType === 'mark' && divisionLvl != 0) {
      throw new BadRequestException(
        `Division lvl must be 0 because the rankedTierType is Mark, your  divisionLvl is:${divisionLvl}`
      );
    }
    if (rankedTier.tierType === 'empty' && (divisionLvl != 0 || marks != 0)) {
      throw new BadRequestException(
        `Division lvl and/or Marks must be 0 because the rankedTierType is ${rankedTier.tierType}, your divisionLvl is:${divisionLvl} and your marks are: ${marks}`
      );
    }
    if (rankedTier.tierType === 'division' && isOutRange(divisionLvl, 1, 4)) {
      throw new BadRequestException(
        `The range value for division lvl is: 1-4, your division lvl is: ${divisionLvl}`
      );
    }
    if (isOutRange(marks, rankedTier.minMarks, rankedTier.maxMarks))
      throw new BadRequestException(
        `The range value for mark is: ${rankedTier.minMarks}-${rankedTier.maxMarks}, your mark  is: ${marks}`
      );
  }
}
