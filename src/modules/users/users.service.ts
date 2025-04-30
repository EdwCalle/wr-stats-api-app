import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
//TO DO
//1. implement admin services(create,update,delete) users ❌
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}
  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }
  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }
  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }
  async findByCredentialwithPassword(credential: string) {
    const isEmail = credential.includes('@');
    const query = isEmail ? { email: credential } : { username: credential };
    const user = await this.userModel.findOne(query).select('+password');
    return user;
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: string) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: string, updateUserDto: UpdateUserDto) {
  //   return this.userModel.findByIdAndUpdate(id, updateUserDto);
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} user`;
  // }
}
