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

@Controller('season-profile')
export class SeasonProfileController {
  constructor(private readonly seasonProfileService: SeasonProfileService) {}

  @Post()
  async create(@Body() createSeasonProfileDto: CreateSeasonProfileDto) {
    //TO DO
    //1. make all controllers async func ❌
    return await this.seasonProfileService.create(createSeasonProfileDto);
  }

  @Get()
  async findAll() {
    return await this.seasonProfileService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.seasonProfileService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateSeasonProfileDto: UpdateSeasonProfileDto
  ) {
    return await this.seasonProfileService.update(id, updateSeasonProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seasonProfileService.remove(id);
  }
}
