import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateRankedTierDto } from './dto/create-ranked-tier.dto';
// import { UpdateRankedTierDto } from './dto/update-ranked-tier.dto';
import { RankedTier } from './schemas/ranked-tier.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RankedTierService {
  constructor(
    @InjectModel(RankedTier.name) private rankedTierModel: Model<RankedTier>
  ) {}
  async create(createRankedTierDto: CreateRankedTierDto) {
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

  // update(id: number, updateRankedTierDto: UpdateRankedTierDto) {
  //   return `This action updates a #${id} rankedTier`;
  // }

  remove(id: number) {
    return `This action removes a #${id} rankedTier`;
  }

  async isOnRange(
    rankedTierID: string,
    divisionLvl: number,
    marks: number
  ): Promise<boolean> {
    const rankedTier: RankedTier = await this.findOne(rankedTierID);
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
    if (
      rankedTier.tierType === 'division' &&
      this.isOutRange(divisionLvl, 1, 4)
    ) {
      throw new BadRequestException(
        `The range value for division lvl is: 1-4, your division lvl is: ${divisionLvl}`
      );
    }
    if (this.isOutRange(marks, rankedTier.minMarks, rankedTier.maxMarks))
      throw new BadRequestException(
        `The range value for mark is: ${rankedTier.minMarks}-${rankedTier.maxMarks}, your mark  is: ${marks}`
      );
    return true;
  }
  private isOutRange(value: number, min: number, max: number): boolean {
    return value < min || value > max;
  }
}
