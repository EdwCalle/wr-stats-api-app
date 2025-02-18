import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id/parse-object-id.pipe';

// import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    return await this.matchesService.create(createMatchDto);
  }

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.matchesService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
  //   return this.matchesService.update(+id, updateMatchDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.matchesService.remove(+id);
  // }
}
