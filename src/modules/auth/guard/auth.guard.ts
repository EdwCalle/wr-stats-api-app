import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CurrentUserI } from 'src/utils/interfaces/current-user.interface';
/**
 * @AuthGuard
 *
 * This guard is responsible for protecting routes that require authentication.
 * It extracts the JWT token from the request header, verifies it, and
 * attaches the user payload to the request object.
 *
 * @implements {CanActivate}
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException("You aren't logged");
    //TO DO
    // change message error ⚠️
    try {
      const payload: CurrentUserI = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET')
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Not valid auth token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
