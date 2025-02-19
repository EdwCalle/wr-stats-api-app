import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
import { RankedTierService } from 'src/ranked-tier/ranked-tier.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    private readonly rankedTierService: RankedTierService
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const { rankedTierID, divisionLvl, marks } = createMatchDto.range;
    try {
      // TO DO
      // add validation seasonProfile exist
      // add validation of: match seasonProfile date  with date
      // add validation of: match rankedTierID season with seasonProfile seasonID (not required)
      if (
        await this.rankedTierService.isOnRange(rankedTierID, divisionLvl, marks) //this can throw errors
      ) {
        return await this.matchModel.create(createMatchDto);
      }
    } catch (error) {
      // console.log(error);
      if (error instanceof NotFoundException) throw error;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code == 11000)
        throw new ConflictException('The match date key is duplicated');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code == 121)
        throw new ConflictException(
          'Error on validation in collection Matches'
        );
      if (error instanceof BadRequestException) throw error;
      throw new HttpException(
        'Someting wrong happen with creating Matches',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error }
      );
    }
  }

  findAll() {
    return this.matchModel.find();
  }

  async findOne(id: string) {
    const match = await this.matchModel.findById(id);
    if (!match) throw new NotFoundException(`Match ${id} not found`);
    return match;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    console.log('from update Service: ', updateMatchDto);
    //TO DO
    //1. Validate if match exist for updating
    //2. Validate isSameDate, transform the date and verifies the date is the same from database
    //3. Validate  isOnRange, this verifies rankedTierID,divisionLvl, marks
    //4. Validate isSeasonProfile, validate if SeasonProfile exist and date belongs to that season profile
    //5. createSeasonProfile
    const match = await this.findOne(id); //this return a match or exception
    if (this.isSameDate(updateMatchDto.date, match.date))
      return await this.matchModel.findByIdAndUpdate(id, updateMatchDto);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} match`;
  // }
  private isSameDate(date1: Date, date2: Date) {
    if (date1.getUTCHours() !== 0)
      throw new BadRequestException(
        `The date: ${date1.toISOString()} must have no time`
      );
    if (date1.getTime() !== date2.getTime())
      throw new BadRequestException(
        `Recived date: ${date1.toISOString()} doesn't match with requested date: ${date2.toISOString()}`
      );
    else return true;
  }
}
