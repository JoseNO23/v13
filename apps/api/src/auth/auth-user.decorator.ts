import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';

export type AuthUserPayload = {
  id: string;
  email: string;
  role: Role;
};

export const AuthUser = createParamDecorator(
  (data: keyof AuthUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthUserPayload }>();
    const user = request.user;
    if (!user) {
      return undefined;
    }
    return data ? user[data] : user;
  },
);
