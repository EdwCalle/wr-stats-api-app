import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserI } from '../interfaces/current-user.interface';
/**
 * Custom decorator to extract the current user from the request object.
 *
 * This decorator can be used in route handlers to easily access the user
 * information that has been attached to the request object, typically by
 * an authentication middleware.
 *
 * @param data - Optional data that can be passed to the decorator.
 * @param ctx - The execution context which provides access to the request object.
 * @returns The current user object cast to the `CurrentUserI` interface.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request['user'] as CurrentUserI;
  }
);
