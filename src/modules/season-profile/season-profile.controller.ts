import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';
import { SeasonProfileService } from './season-profile.service';
import { CreateSeasonProfileDto } from './dto/create-season-profile.dto';
import { UpdateSeasonProfileDto } from './dto/update-season-profile.dto';
import { ParseObjectIdPipe } from 'src/utils/pipes/parse-object-id/parse-object-id.pipe';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { CurrentUserI } from 'src/utils/interfaces/current-user.interface';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';

@Auth(Role.ADMIN, Role.USER)
@Controller('season-profile')
export class SeasonProfileController {
  constructor(private readonly seasonProfileService: SeasonProfileService) {}

  @Post()
  async create(
    @Body() createSeasonProfileDto: CreateSeasonProfileDto,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    //TO DO
    //1. (global) make all controllers async func ❌

    return await this.seasonProfileService.create(
      createSeasonProfileDto,
      currentUserI
    );
  }

  @Get()
  async findAll(@CurrentUser() currentUserI: CurrentUserI) {
    return await this.seasonProfileService.findAll(currentUserI);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    return await this.seasonProfileService.findOne(id, currentUserI);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateSeasonProfileDto: UpdateSeasonProfileDto,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    return await this.seasonProfileService.update(
      id,
      updateSeasonProfileDto,
      currentUserI
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    return await this.seasonProfileService.remove(id, currentUserI);
  }
}
