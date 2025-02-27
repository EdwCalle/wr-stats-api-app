import { Controller, ForbiddenException, Get } from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { ParseObjectIdPipe } from 'src/utils/pipes/parse-object-id/parse-object-id.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  index() {
    throw new ForbiddenException();
  }

  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Post()
  // async create(@Body() createUserDto: CreateUserDto) {
  //   return await this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseObjectIdPipe) id: string) {
  //   return this.usersService.findOne(id);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id', ParseObjectIdPipe) id: string,
  //   @Body() updateUserDto: UpdateUserDto
  // ) {
  //   return await this.usersService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseObjectIdPipe) id: string) {
  //   return this.usersService.remove(id);
  // }
}
