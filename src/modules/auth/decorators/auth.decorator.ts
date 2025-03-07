import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../../../utils/enums/role.enum';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { AuthGuard } from '../guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
/**
 * A decorator that combines the `Roles` decorator, `AuthGuard`, and `RolesGuard`.
 * It first sets the roles using the `Roles` decorator, then applies the `AuthGuard` to ensure authentication,
 * and finally applies the `RolesGuard` to ensure authorization based on the provided roles.
 *
 * @param role An array of roles that are allowed to access the decorated route.
 *
 * @example
 * ```typescript
 * @Auth(Role.Admin, Role.Editor)
 * async myAdminRoute() {
 *   // ...
 * }
 * ```
 */
export function Auth(...role: Role[]) {
  //TO D0
  //for swagger: we set ApiBearerAuth here when resourcce auth is needed ⚠️
  return applyDecorators(
    ApiBearerAuth(),
    Roles(...role),
    UseGuards(AuthGuard, RolesGuard)
  );
}
