import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch
} from '@nestjs/common';
import { RankedTierService } from './ranked-tier.service';
import { ParseObjectIdPipe } from 'src/utils/pipes/parse-object-id/parse-object-id.pipe';

import { CreateRankedTierDto } from './dto/create-ranked-tier.dto';
import { UpdateRankedTierDto } from './dto/update-ranked-tier.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/utils/enums/role.enum';
@Auth(Role.ADMIN, Role.USER)
@Controller('ranked-tier')
export class RankedTierController {
  constructor(private readonly rankedTierService: RankedTierService) {}
  //TO DO
  //1. add permission  to create, update and delete rankedTier just for admin ❌
  @Post()
  async create(@Body() createRankedTierDto: CreateRankedTierDto) {
    return await this.rankedTierService.create(createRankedTierDto);
  }

  @Get()
  async findAll() {
    return await this.rankedTierService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.rankedTierService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateRankedTierDto: UpdateRankedTierDto
  ) {
    return await this.rankedTierService.update(id, updateRankedTierDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.rankedTierService.remove(id);
  }
}
