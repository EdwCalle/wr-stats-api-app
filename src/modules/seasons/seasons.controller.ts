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
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/utils/enums/role.enum';
@Auth(Role.ADMIN, Role.USER)
@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}
  @Auth(Role.ADMIN)
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
  @Auth(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateSeasonDto: UpdateSeasonDto
  ) {
    return await this.seasonsService.update(id, updateSeasonDto);
  }
  @Auth(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.seasonsService.remove(id);
  }
}
