import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete
} from '@nestjs/common';
import { RankedTierService } from './ranked-tier.service';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id/parse-object-id.pipe';

import { CreateRankedTierDto } from './dto/create-ranked-tier.dto';
// import { UpdateRankedTierDto } from './dto/update-ranked-tier.dto';

@Controller('ranked-tier')
export class RankedTierController {
  constructor(private readonly rankedTierService: RankedTierService) {}

  @Post()
  create(@Body() createRankedTierDto: CreateRankedTierDto) {
    return this.rankedTierService.create(createRankedTierDto);
  }

  @Get()
  findAll() {
    return this.rankedTierService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.rankedTierService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateRankedTierDto: UpdateRankedTierDto,
  // ) {
  //   return this.rankedTierService.update(+id, updateRankedTierDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rankedTierService.remove(+id);
  }
}
