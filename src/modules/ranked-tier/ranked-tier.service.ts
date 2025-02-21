import { Injectable, NotFoundException } from '@nestjs/common';
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
}
