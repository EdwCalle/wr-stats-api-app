import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcriptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}
  async login({ credential, password }: LoginDto) {
    const user =
      await this.usersService.findByCredentialwithPassword(credential);
    if (!user) throw new UnauthorizedException('no email/username found');
    if (!(await bcriptjs.compare(password, user.password)))
      throw new UnauthorizedException('password is not correct');
    const payload = {
      uid: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      timezone: user.timezone
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      email: user.email
    };
  }
  async register({ username, email, password, timezone }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) throw new BadRequestException('User/email already used');
    const newUser = await this.usersService.create({
      username,
      email,
      password: await bcriptjs.hash(password, 10),
      timezone
    });
    return { username, email, id: newUser._id };
  }
  async profile(email: string) {
    return await this.usersService.findOneByEmail(email);
  }
}
