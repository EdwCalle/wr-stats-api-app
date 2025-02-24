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

@Controller('season-profile')
export class SeasonProfileController {
  constructor(private readonly seasonProfileService: SeasonProfileService) {}

  @Post()
  create(@Body() createSeasonProfileDto: CreateSeasonProfileDto) {
    return this.seasonProfileService.create(createSeasonProfileDto);
  }

  @Get()
  findAll() {
    return this.seasonProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seasonProfileService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSeasonProfileDto: UpdateSeasonProfileDto
  ) {
    return this.seasonProfileService.update(+id, updateSeasonProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seasonProfileService.remove(+id);
  }
}
