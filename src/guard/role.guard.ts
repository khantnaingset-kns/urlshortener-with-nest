import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ROLES_KEY } from '../decorator';
import { Reflector } from '@nestjs/core';
import { Role } from '../module/api-user/enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { userRole } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => role === userRole);
  }
}
