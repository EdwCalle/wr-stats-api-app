import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { ParseObjectIdPipe } from 'src/utils/pipes/parse-object-id/parse-object-id.pipe';

import { UpdateMatchDto } from './dto/update-match.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { CurrentUserI } from 'src/utils/interfaces/current-user.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { FilterDateMatchDTO } from './dto/filter-date-match.dto';
import { PaginationMatchDto } from './dto/pagination-match.dto';
import { FiltersMatchDto } from './dto/filters-match.dto';
@Auth(Role.ADMIN, Role.USER)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async create(
    @Body() createMatchDto: CreateMatchDto,
    @Query() filterDateMatchDTO: FilterDateMatchDTO,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    return await this.matchesService.create(
      createMatchDto,
      filterDateMatchDTO,
      currentUserI
    );
  }

  @Get()
  async findAll(
    @CurrentUser() currentUserI: CurrentUserI,
    @Query() paginationMatchDto: PaginationMatchDto,
    @Query() filtersMatchDto: FiltersMatchDto
  ) {
    return await this.matchesService.findAllComplete(
      currentUserI,
      paginationMatchDto,
      filtersMatchDto
    );
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
    @Query() filterDateMatchDTO: FilterDateMatchDTO,
    @Body() updateMatchDto: UpdateMatchDto,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    return this.matchesService.update(
      id,
      filterDateMatchDTO,
      updateMatchDto,
      currentUserI
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() filterDateMatchDTO: FilterDateMatchDTO,
    @CurrentUser() currentUserI: CurrentUserI
  ) {
    return await this.matchesService.remove(
      id,
      filterDateMatchDTO,
      currentUserI
    );
  }
}
