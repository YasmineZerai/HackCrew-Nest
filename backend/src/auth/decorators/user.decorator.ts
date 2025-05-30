import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '@src/auth/interfaces/auth.interface';
import { RequestWithUser } from '@src/auth/interfaces/auth.interface';

export const ConnectedUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (data && data in user) {
      return user[data];
    }
    return user;
  },
);
