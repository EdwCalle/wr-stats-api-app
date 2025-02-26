import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateSeasonProfileDto } from './dto/create-season-profile.dto';
import { UpdateSeasonProfileDto } from './dto/update-season-profile.dto';
import { Model } from 'mongoose';
import { SeasonProfile } from './schemas/season-profile.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SeasonProfileService {
  constructor(
    @InjectModel(SeasonProfile.name)
    private seasonProfileModel: Model<SeasonProfile>
  ) {}
  async create(createSeasonProfileDto: CreateSeasonProfileDto) {
    //TO DO
    //1. checkUser ❌
    //2. checkSeason ❌
    //3. disable 'any' conflict in errors ❌
    try {
      return await this.seasonProfileModel.create(createSeasonProfileDto);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 1100) {
        throw new ConflictException('UserID and SeasonID are repeated');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.seasonProfileModel.find();
  }

  async findOne(id: string) {
    const seasonProfile = await this.seasonProfileModel.findById(id);
    if (!seasonProfile)
      throw new NotFoundException(`Season Profile with id '${id}' not found`);
    return seasonProfile;
  }

  async update(id: string, updateSeasonProfileDto: UpdateSeasonProfileDto) {
    //TO DO
    //1. check user && check season compound are the same from id (its like it the 2 are one id) dont update this values ❌
    //3. (global) set conventions rules for future updates ❌
    //4. (global) UNIT testing in required scripts files ❌
    try {
      await this.findOne(id);
      return await this.seasonProfileModel.findByIdAndUpdate(
        id,
        updateSeasonProfileDto
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        throw new ConflictException(
          'Error userID/seasonID compound duplicated index'
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    //TO DO
    //1. check if exist seasonProfile ✅
    //2. check if used, then not to delete,else continue ❌
    await this.findOne(id);
    await this.onDeleteConstraintKey(id);
    return await this.seasonProfileModel.findByIdAndDelete(id);
  }
  //Validations
  private async checkUser() {}
  private async checkSeason() {}
  //constraints keys
  private async onDeleteConstraintKey(id: string) {
    //TO DO
    // fix any problem
    const seasonProfile: any = await this.seasonProfileModel
      .findById(id)
      .populate('matches')
      .exec();
    console.log(seasonProfile);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (seasonProfile.matches) {
      throw new ConflictException('SeasonProfile already in use');
    }
  }
}
