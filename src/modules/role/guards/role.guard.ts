import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this._reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    let hasRole=false;
    for (let index = 0; index < user.roles.length; index++) {
      const userRole = user.roles[index];

      for (let index = 0; index < roles.length; index++) {
        const controllerRole = roles[index];
        if (userRole===controllerRole) {
          hasRole = true;
        }
      }
    }

    return user && user.roles && hasRole;
  }
}
