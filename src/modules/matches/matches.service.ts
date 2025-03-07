import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateMatchDto, RangeDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from './schemas/match.schema';
import { RankedTierService } from 'src/modules/ranked-tier/ranked-tier.service';
import { CurrentUserI } from 'src/utils/interfaces/current-user.interface';
import { Role } from 'src/utils/enums/role.enum';
import { SeasonProfileService } from '../season-profile/season-profile.service';
import { MatchQueryDTO } from './dto/match-query.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    private readonly rankedTierService: RankedTierService,
    private readonly seasonProfileService: SeasonProfileService
  ) {}

  async create(createMatchDto: CreateMatchDto, currentUserI: CurrentUserI) {
    try {
      // TO DO
      // check seasonProfile FK ✅
      //  check seasonDate✅
      // check rankedTier FK ✅
      // check range ✅
      const { seasonProfileID, range, date } = createMatchDto;
      await this.checkSeasonDate(seasonProfileID, date, currentUserI);
      await this.checkRange(range);
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

  async findAll(currentUserI: CurrentUserI) {
    if (currentUserI.role === Role.ADMIN) {
      return this.matchModel.find();
    }
    const seasonProfiles =
      await this.seasonProfileService.findAll(currentUserI);
    const seasonProfilesID = seasonProfiles.map((sp) => sp._id);
    return this.matchModel.find({ seasonProfileID: { $in: seasonProfilesID } });
  }

  async findOne(id: string, currentUserI: CurrentUserI) {
    const match = await this.matchModel.findById(id);
    if (!match) throw new NotFoundException(`Match ${id} not found`);
    await this.seasonProfileService.findOne(
      match.seasonProfileID,
      currentUserI
    );
    return match;
  }
  async findOneByDate(_id: string, date: Date, currentUserI: CurrentUserI) {
    const match = await this.matchModel.findOne({ _id, date });
    if (!match)
      throw new NotFoundException(
        `Match ${_id} not found with date ${date.toISOString()}`
      );
    await this.seasonProfileService.findOne(
      match.seasonProfileID,
      currentUserI
    );
    return match;
  }

  async update(
    id: string,
    matchQueryDTO: MatchQueryDTO,
    updateMatchDto: UpdateMatchDto,
    currentUserI: CurrentUserI
  ) {
    //TO DO
    //1. check match and check same date ✅
    //2. check Range and check fk sesonProfileID ✅
    //3. check seasonDate, and check rankedTierID ✅
    //4. optimze ownership from : findOnebyDate and checkSeasonDate ❌

    console.log('from update query dto: ', matchQueryDTO);
    const { date } = matchQueryDTO;
    await this.findOneByDate(id, date, currentUserI);
    if (updateMatchDto.range) await this.checkRange(updateMatchDto.range);
    if (updateMatchDto.seasonProfileID)
      await this.checkSeasonDate(
        updateMatchDto.seasonProfileID,
        date,
        currentUserI
      );
    return await this.matchModel.findByIdAndUpdate(id, updateMatchDto);
  }

  async remove(
    id: string,
    matchQueryDTO: MatchQueryDTO,
    currentUserI: CurrentUserI
  ) {
    //TO DO
    //1. check match and check same date ✅
    await this.findOneByDate(id, matchQueryDTO.date, currentUserI);
    return await this.matchModel.findByIdAndDelete(id);
  }

  // VALIDATIONS
  //FK (IN sql db this is not nesesary)
  private async seasonProfileFk(fk: string, currentUserI: CurrentUserI) {
    return await this.seasonProfileService.findOne(fk, currentUserI);
  }
  private async rankedTierFk(fk: string) {
    return await this.rankedTierService.findOne(fk);
  }
  // CUSTOM fK Encapsulation
  private async checkSeasonDate(
    seasonProfileID: string,
    date: Date,
    currentUserI: CurrentUserI
  ) {
    const seasonProfile = await this.seasonProfileFk(
      seasonProfileID,
      currentUserI
    );
    await this.seasonProfileService.checkSeasonDate(date, seasonProfile);
  }
  private async checkRange(range: RangeDto) {
    const { rankedTierID, divisionLvl, marks } = range;
    const rankedTier = await this.rankedTierFk(rankedTierID);
    this.rankedTierService.checkRange(divisionLvl, marks, rankedTier);
  }
}
