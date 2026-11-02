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
import { Match, MatchDocument } from './schemas/match.schema';
import { RankedTierService } from 'src/modules/ranked-tier/ranked-tier.service';
import { CurrentUserI } from 'src/utils/interfaces/current-user.interface';
import { Role } from 'src/utils/enums/role.enum';
import { SeasonProfileService } from '../season-profile/season-profile.service';
import { FilterDateMatchDTO } from './dto/filter-date-match.dto';
import { MatchPopulate } from './populates/match.populate';
import { PaginationMatchDto } from './dto/pagination-match.dto';
import { FiltersMatchDto } from './dto/filters-match.dto';
import {
  isSameDate,
  isSameTimeZone
} from 'src/utils/validators/data.validator';
import { NormalizeDate } from 'src/utils/transforms/date.transform';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    private readonly rankedTierService: RankedTierService,
    private readonly seasonProfileService: SeasonProfileService
  ) {}

  async create(
    createMatchDto: CreateMatchDto,
    filterDateMatchDTO: FilterDateMatchDTO,
    currentUserI: CurrentUserI
  ) {
    try {
      // TO DO
      //check unique date ✅
      // check seasonProfile FK ✅
      //  check seasonDate✅
      // check rankedTier FK ✅
      // check range ✅
      const { seasonProfileID, range, victories, defeats } = createMatchDto;
      const { date } = filterDateMatchDTO;
      await this.checkUniqueDate(filterDateMatchDTO, currentUserI);
      await this.checkSeasonDate(seasonProfileID, date, currentUserI);
      await this.checkRange(range);
      this.checkDiffZero(victories, defeats);
      return await this.matchModel.create({ ...createMatchDto, date });
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

  async findAllComplete(
    currentUserI: CurrentUserI,
    paginationMatchDto: PaginationMatchDto,
    filtersMatchDto: FiltersMatchDto
  ) {
    // TO DO
    // send total pages or results to client ❌

    const cleanFilter = Object.fromEntries(
      Object.entries(filtersMatchDto).filter(([, value]) => value !== undefined)
    );

    const limit = paginationMatchDto.limit;
    const skip = (paginationMatchDto.page - 1) * limit;
    if (currentUserI.role === Role.ADMIN) {
      return this.matchModel
        .find()
        .populate({
          path: 'seasonProfileID',
          populate: {
            path: 'seasonID'
          }
        })
        .populate(MatchPopulate.seasonProfile)
        .populate(MatchPopulate.rankedTier);
    }
    const seasonProfiles =
      await this.seasonProfileService.findAll(currentUserI);

    const seasonProfilesID = seasonProfiles.map((sp) => sp._id);
    return await this.matchModel
      .find({ seasonProfileID: { $in: seasonProfilesID } })
      .where(cleanFilter)
      .populate(MatchPopulate.seasonProfile)
      .populate(MatchPopulate.rankedTier)
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 });
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
    if (!match) throw new NotFoundException(`no Match ${id} found`);
    await this.seasonProfileService.findOne(
      match.seasonProfileID,
      currentUserI
    );
    return match;
  }
  async findOneByDate(
    filterDateMatchDTO: FilterDateMatchDTO,
    currentUserI: CurrentUserI
  ) {
    const { date, timezone } = filterDateMatchDTO;
    const targetDate = NormalizeDate(date, timezone);
    const matches = await this.findAll(currentUserI);

    if (!isSameTimeZone(currentUserI.timezone, timezone))
      throw new BadRequestException(
        `Account Timezone '${currentUserI.timezone}' doesnt match with your local timezone '${timezone}'`
      );
    // console.log(currentUserI.timezone, timezone);

    for (const match of matches) {
      const matchDate = NormalizeDate(match.date, timezone);
      if (isSameDate(targetDate, matchDate)) {
        await this.seasonProfileService.findOne(
          match.seasonProfileID,
          currentUserI
        );
        return match;
      }
    }
  }

  async update(
    id: string,
    filterDateMatchDTO: FilterDateMatchDTO,
    updateMatchDto: UpdateMatchDto,
    currentUserI: CurrentUserI
  ) {
    //TO DO
    //1. check unique date ✅
    //1. check match and check same date ✅
    //2. check Range and check fk sesonProfileID ✅
    //3. check seasonDate, and check rankedTierID ✅
    //4. optimze ownership from : findOnebyDate and checkSeasonDate ❌

    const { date } = filterDateMatchDTO;
    const foundMatch = await this.findBySameDateID(
      id,
      filterDateMatchDTO,
      currentUserI
    );
    if (updateMatchDto.range) await this.checkRange(updateMatchDto.range);
    if (updateMatchDto.seasonProfileID)
      await this.checkSeasonDate(
        updateMatchDto.seasonProfileID,
        date,
        currentUserI
      );

    const victories = updateMatchDto.victories ?? foundMatch.victories;
    const defeats = updateMatchDto.defeats ?? foundMatch.defeats;
    this.checkDiffZero(victories, defeats);

    return await this.matchModel.findByIdAndUpdate(id, updateMatchDto);
  }

  async remove(
    id: string,
    filterDateMatchDTO: FilterDateMatchDTO,
    currentUserI: CurrentUserI
  ) {
    //TO DO
    //1. check match and check same date ✅
    await this.findBySameDateID(id, filterDateMatchDTO, currentUserI);
    return await this.matchModel.findByIdAndDelete(id);
  }

  // VALIDATIONS
  // local validator
  private checkDiffZero(victories: number, defeats: number) {
    if (victories === 0 && defeats === 0)
      throw new BadRequestException(
        'victories and defeats be greater than zero'
      );
  }
  private async checkUniqueDate(
    filterDateMatchDTO: FilterDateMatchDTO,
    currentUserI: CurrentUserI
  ) {
    const match = await this.findOneByDate(filterDateMatchDTO, currentUserI);
    if (match) throw new BadRequestException('date already in use');
  }
  private async findBySameDateID(
    id: string,
    filterDateMatchDTO: FilterDateMatchDTO,
    currentUserI: CurrentUserI
  ) {
    const match = await this.findOneByDate(filterDateMatchDTO, currentUserI);
    const { date } = filterDateMatchDTO;
    if (!match)
      throw new BadRequestException(
        `the match with this date ${date.toISOString()} does not exist`
      );
    if (match.id !== id)
      throw new BadRequestException(
        `this date ${date.toISOString()} does not belong to this id ${id}`
      );
    return match;
  }
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
