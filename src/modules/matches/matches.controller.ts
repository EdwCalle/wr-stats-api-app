import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { ParseObjectIdPipe } from 'src/utils/pipes/parse-object-id/parse-object-id.pipe';

import { UpdateMatchDto } from './dto/update-match.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { CurrentUserI } from 'src/utils/interfaces/current-user.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { MatchQueryDTO } from './dto/match-query.dto';
@Auth(Role.ADMIN, Role.USER)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async create(
    @Body() createMatchDto: CreateMatchDto,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    return await this.matchesService.create(createMatchDto, currentUserI);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@CurrentUser() currentUserI: CurrentUserI) {
    return await this.matchesService.findAll(currentUserI);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    return await this.matchesService.findOne(id, currentUserI);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() matchQueryDTO: MatchQueryDTO,
    @Body() updateMatchDto: UpdateMatchDto,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    return this.matchesService.update(
      id,
      matchQueryDTO,
      updateMatchDto,
      currentUserI
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() matchQueryDTO: MatchQueryDTO,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    return await this.matchesService.remove(id, matchQueryDTO, currentUserI);
  }
}
