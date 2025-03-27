import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Season } from './schemas/season.schema';
import { Model } from 'mongoose';
import { isOutRange } from 'src/utils/validators/data.validator';

@Injectable()
export class SeasonsService {
  constructor(@InjectModel(Season.name) private seasonModel: Model<Season>) {}

  async create(createSeasonDto: CreateSeasonDto) {
    //TO DO
    //1. check date  ✅
    const { startDate, finishDate } = createSeasonDto;
    this.checkDate(startDate, finishDate);
    return await this.seasonModel.create(createSeasonDto);
  }

  async findAll() {
    return await this.seasonModel.find().sort({ startDate: -1 });
  }

  async findOne(id: string) {
    const season = await this.seasonModel.findById(id);
    if (!season)
      throw new NotFoundException(`Season with id '${id}' not found`);
    return season;
  }

  async update(id: string, updateSeasonDto: UpdateSeasonDto) {
    //TO DO
    //1. check updateConstraint ✅
    //2. check date ✅
    const oldSeason = await this.findOne(id);

    const startDate = updateSeasonDto.startDate
      ? updateSeasonDto.startDate
      : oldSeason.startDate;

    const finishDate =
      updateSeasonDto.finishDate || updateSeasonDto.finishDate === null
        ? updateSeasonDto.finishDate
        : oldSeason.finishDate;

    this.checkDate(startDate, finishDate);
    await this.onConstraintKey(id);
    return await this.seasonModel.findByIdAndUpdate(id, updateSeasonDto);
  }

  async remove(id: string) {
    //TO DO
    //1. check deleteConstraint ❌
    await this.findOne(id);
    await this.onConstraintKey(id);
    return await this.seasonModel.findByIdAndDelete(id);
  }

  //Local validations
  private checkDate(startDate: Date, finishDate: Date | null) {
    if (finishDate && startDate.getTime() >= finishDate.getTime())
      throw new BadRequestException(
        `finish date ${finishDate.toISOString()} must be greater then finsih date ${startDate.toISOString()}`
      );
  }
  // constraints fk
  private async onConstraintKey(id: string) {
    //TO DO
    //(global) check population array  has something ❌
    const season: any = await this.seasonModel
      .findById(id)
      .populate('seasonProfile');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (season.seasonProfile) {
      throw new ConflictException('Season already in use');
    }
  }
  // CUSTOM fK Encapsulation for seasonProfile
  checkSeasonDate(date: Date, season: Season) {
    const { startDate, finishDate } = season;
    const dateTimestamp = date.getTime();
    const startTimestamp = startDate.getTime();
    const finishTimestamp = finishDate ? finishDate.getTime() : dateTimestamp;
    if (isOutRange(dateTimestamp, startTimestamp, finishTimestamp)) {
      throw new BadRequestException(
        `Date ${date.toISOString()} is out of range for the season ${season.seasonName}: ${startDate.toISOString()} - ${finishDate?.toISOString()}`
      );
    }
  }
}
