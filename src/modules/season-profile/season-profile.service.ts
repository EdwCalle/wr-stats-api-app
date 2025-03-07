import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSeasonProfileDto } from './dto/create-season-profile.dto';
import { UpdateSeasonProfileDto } from './dto/update-season-profile.dto';
import {
  SeasonProfile,
  SeasonProfileDocument
} from './schemas/season-profile.schema';
import { UsersService } from '../users/users.service';
import { SeasonsService } from '../seasons/seasons.service';
import { CurrentUserI } from 'src/utils/interfaces/current-user.interface';
import { Role } from 'src/utils/enums/role.enum';

@Injectable()
export class SeasonProfileService {
  constructor(
    @InjectModel(SeasonProfile.name)
    private readonly seasonProfileModel: Model<SeasonProfileDocument>,
    private readonly usersService: UsersService,
    private readonly seasonsService: SeasonsService
  ) {}
  async create(
    createSeasonProfileDto: CreateSeasonProfileDto,
    currentUserID: CurrentUserI
  ) {
    //TO DO
    //1. checkUser ✅
    //2. checkSeason ✅
    //3. disable 'any' conflict in errors ❌
    const { userID, seasonID } = createSeasonProfileDto;
    await this.checkUserFK(userID);
    await this.checkOwnership(userID, currentUserID);
    await this.checkSeasonFK(seasonID);
    try {
      const model = new this.seasonProfileModel(createSeasonProfileDto);
      console.log(' am model', model);
      return await this.seasonProfileModel.create(model);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000)
        throw new ConflictException(
          'Error userID/seasonID compound duplicated index'
        );
      throw error;
    }
  }

  async findAll(currentUserI: CurrentUserI) {
    if (currentUserI.role === Role.ADMIN) {
      return await this.seasonProfileModel.find();
    }
    return await this.seasonProfileModel.find({
      userID: new Types.ObjectId(currentUserI.uid)
    });
  }

  async findOne(id: string, currentUserID: CurrentUserI) {
    const seasonProfile = await this.seasonProfileModel.findById(id);
    if (!seasonProfile)
      throw new NotFoundException(`Season Profile with id '${id}' not found`);
    await this.checkOwnership(seasonProfile.userID.toString(), currentUserID);
    return seasonProfile;
  }

  async update(
    id: string,
    updateSeasonProfileDto: UpdateSeasonProfileDto,
    currentUserI: CurrentUserI
  ) {
    //TO DO
    //3. (global) set conventions rules for future updates ❌
    //4. (global) UNIT testing in required scripts files ❌
    await this.findOne(id, currentUserI);
    try {
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

  async remove(id: string, currentUserI: CurrentUserI) {
    //TO DO
    //1. check if exist seasonProfile ✅
    //2. check if used, then not to delete,else continue ✅
    await this.findOne(id, currentUserI);
    await this.onDeleteConstraintKey(id);
    return await this.seasonProfileModel.findByIdAndDelete(id);
  }
  //Validations
  // check the current user if still exists
  private async checkOwnership(userID: string, currentUserI: CurrentUserI) {
    const user = await this.usersService.findOne(currentUserI.uid);
    if (!user)
      throw new NotFoundException(
        `Current User with id '${currentUserI.uid}' not found`
      );
    if (currentUserI.role === Role.USER && userID !== currentUserI.uid) {
      throw new UnauthorizedException(
        'Season Profile Resource not allowed for this user'
      );
    }
  }
  //TO DO
  //1. in (Users) when delete an user, check if the users extis ❌
  //FK
  private async checkUserFK(userID: string) {
    const userFK = await this.usersService.findOne(userID);
    if (!userFK)
      throw new NotFoundException(
        `User from seasonProfile with id '${userID}' not found`
      );
    // await this.checkOwnership(userID, currentUserID);
  }
  private async checkSeasonFK(seasonID: string) {
    return await this.seasonsService.findOne(seasonID);
  }
  // CUSTOM fK Encapsulation for matches
  async checkSeasonDate(date: Date, seasonProfile: SeasonProfile) {
    const season = await this.checkSeasonFK(seasonProfile.seasonID.toString());
    this.seasonsService.checkSeasonDate(date, season);
  }
  //constraints keys (one to many)
  private async onDeleteConstraintKey(id: string) {
    //TO DO
    // fix any problem ❌
    const seasonProfile: any = await this.seasonProfileModel
      .findById(id)
      .populate('matches')
      .exec();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (seasonProfile.matches)
      throw new ConflictException('SeasonProfile already in use');
  }
}
//67b90ccf35da6bad5bb5900f
