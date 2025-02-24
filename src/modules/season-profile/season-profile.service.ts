import { Injectable } from '@nestjs/common';
import { CreateSeasonProfileDto } from './dto/create-season-profile.dto';
import { UpdateSeasonProfileDto } from './dto/update-season-profile.dto';

@Injectable()
export class SeasonProfileService {
  create(createSeasonProfileDto: CreateSeasonProfileDto) {
    return 'This action adds a new seasonProfile';
  }

  findAll() {
    return `This action returns all seasonProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seasonProfile`;
  }

  update(id: number, updateSeasonProfileDto: UpdateSeasonProfileDto) {
    return `This action updates a #${id} seasonProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} seasonProfile`;
  }
}
