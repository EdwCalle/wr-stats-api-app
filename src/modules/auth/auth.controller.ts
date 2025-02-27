import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../../utils/enums/role.enum';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { CurrentUserI } from 'src/utils/interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  //TO DO
  //1.  detect domain for accesss to log in, (separe login for admin and user)❌
  //2. implements change password ❌
  //3.  (global)Fix relative routes ❌
  //4. (global) config swagger ❌
  //5. (global) config deploy (secret jwt,database,logger handler)❌
  //6. (global) improve message on errors (dont show important impormation)❌
  //6. assign roles to others modules ❌
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
  @Get('profile')
  @Auth(Role.ADMIN, Role.USER)
  async profile(@CurrentUser() currentUserI: CurrentUserI) {
    const { email } = currentUserI;
    return this.authService.profile(email);
  }
}
