import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateMatchDto, RangeDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
import { RankedTierService } from 'src/modules/ranked-tier/ranked-tier.service';
import { DeleteMatchDto } from './dto/delete-match.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    private readonly rankedTierService: RankedTierService
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    try {
      // TO DO
      // add validation seasonProfile exist ❌
      // add validation of: match seasonProfile date  with date ❌
      // add validation of: match rankedTierID season with seasonProfile seasonID (not required)
      // check range ✅

      await this.checkRange(createMatchDto.range); //this can throw errors
      return await this.matchModel.create(createMatchDto);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code == 11000)
        throw new ConflictException('The match date key is duplicated');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code == 121)
        throw new ConflictException(
          'Error on validation in collection Matches'
        );
      throw error;
    }
  }

  findAll() {
    console.log('match name:', Match.name);

    return this.matchModel.find().populate('range.rankedTierID');
  }

  async findOne(id: string) {
    const match = await this.matchModel.findById(id);
    if (!match) throw new NotFoundException(`Match ${id} not found`);

    return match;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    // console.log('from update Service: ', updateMatchDto);

    //TO DO
    //1. Validate if match exist for updating ✅
    //2. Validate isSameDate, transform the date and verifies the date is the same from database ✅
    //3. Validate  isOnRange, this verifies rankedTierID,divisionLvl, marks ✅
    //4. Validate isSeasonProfile, validate if SeasonProfile exist and date belongs to that season profile,
    //    and date fits that season ❌

    const match = await this.findOne(id); //this return a match or exception
    this.checkSameDate(updateMatchDto.date, match.date);
    if (updateMatchDto.seasonProfileID)
      await this.checkSeasonProfile(updateMatchDto.seasonProfileID);
    if (updateMatchDto.range) await this.checkRange(updateMatchDto.range);
    return await this.matchModel.findByIdAndUpdate(id, updateMatchDto);
  }

  async remove(id: string, deleteMatchDto: DeleteMatchDto) {
    const match = await this.findOne(id);
    this.checkSameDate(deleteMatchDto.date, match.date);

    return await this.matchModel.findByIdAndDelete(id);
  }

  // VALIDATIONS
  private checkSameDate(date1: Date, date2: Date) {
    if (date1.getUTCHours() !== 0)
      throw new BadRequestException(
        `The date: ${date1.toISOString()} must have no time`
      );
    if (date1.getTime() !== date2.getTime())
      throw new BadRequestException(
        `Recived date: ${date1.toISOString()} doesn't match with requested date: ${date2.toISOString()}`
      );
  }

  private async checkRange(rangeDto: RangeDto) {
    //TO DO
    //1. USE populate instead of Service ❌
    const { rankedTierID, divisionLvl, marks } = rangeDto;
    const rankedTier = await this.rankedTierService.findOne(rankedTierID);
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
  }
  private async checkSeasonProfile(id: string) {
    const seasonProfile = await this.rankedTierService.findOne(id);
    if (!seasonProfile)
      throw new NotFoundException(`seasonProfile of Match ${id} not found`);
  }
  private isOutRange(value: number, min: number, max: number): boolean {
    return value < min || value > max;
  }
}
