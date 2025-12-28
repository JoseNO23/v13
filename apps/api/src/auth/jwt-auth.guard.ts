import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from './auth.constants';

type AuthPayload = {
  sub: string;
  email: string;
  role: Role;
};

type RequestWithUser = Request & {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
};

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) {
    return undefined;
  }

  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [key, value] = part.trim().split('=');
    if (key === name) {
      return value ? decodeURIComponent(value) : '';
    }
  }
  return undefined;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = req.headers?.authorization;
    const bearerToken =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : undefined;
    const cookieToken = getCookieValue(req.headers?.cookie, 'auth_token');
    const token = bearerToken || cookieToken;

    if (!token) {
      throw new UnauthorizedException('Token requerido.');
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
      req.user = { id: payload.sub, email: payload.email, role: payload.role };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalido.');
    }
  }
}
