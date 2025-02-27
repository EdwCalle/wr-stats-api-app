import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../../utils/enums/role.enum';
import { CurrentUserI } from 'src/utils/interfaces/current-user.interface';
/**
 * @class RolesGuard
 * @classdesc This guard is responsible for checking if the user has the required roles to access a specific route.
 * It uses the `ROLES_KEY` metadata defined by the `Roles` decorator to determine the required roles.
 * It retrieves the user object from the request and checks if the user's role is included in the required roles.
 * @implements {CanActivate}
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const definedRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!definedRoles) return true;
    const { user }: { user: CurrentUserI } = context
      .switchToHttp()
      .getRequest();
    return definedRoles.includes(user.role);
  }
}
