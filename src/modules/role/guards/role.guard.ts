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

    let hasRole;

    for (let index = 0; index < user.roles.length; index++) {
      const element = user.roles[index];
      hasRole = () => roles.includes(element);
      console.log(hasRole());
      if (hasRole()) {
        return user && user.roles && hasRole();
      }
    }

    return user && user.roles && hasRole();
  }
}
