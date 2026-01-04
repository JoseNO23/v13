import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import type { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';

type RequestWithUser = Request & {
  user?: {
    role: Role;
  };
};

const ROLE_RANK: Record<Role, number> = {
  GUEST: 0,
  USER: 1,
  CREATOR: 2,
  COLLABORATOR: 3,
  MODERATOR: 4,
  ADMIN: 5,
  SUPER_ADMIN: 6,
  OWNER: 7,
};

const hasRequiredRole = (required: Role[], currentRole: Role) => {
  if (required.length === 0) return true;
  const currentRank = ROLE_RANK[currentRole];
  return required.some((role) => ROLE_RANK[role] <= currentRank);
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Rol requerido.');
    }

    if (!hasRequiredRole(requiredRoles, user.role)) {
      throw new ForbiddenException('Rol insuficiente.');
    }

    return true;
  }
}
