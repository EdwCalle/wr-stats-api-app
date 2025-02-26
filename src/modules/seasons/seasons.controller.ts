import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { ParseObjectIdPipe } from 'src/utils/pipes/parse-object-id/parse-object-id.pipe';

@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Post()
  async create(@Body() createSeasonDto: CreateSeasonDto) {
    return await this.seasonsService.create(createSeasonDto);
  }

  @Get()
  async findAll() {
    return await this.seasonsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.seasonsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateSeasonDto: UpdateSeasonDto
  ) {
    return await this.seasonsService.update(id, updateSeasonDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.seasonsService.remove(id);
  }
}
