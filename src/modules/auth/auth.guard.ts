import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Configuration } from '../../config/config.keys';
import { ConfigService } from '../../config/config.service';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthGuardService implements CanActivate {



  async canActivate(context: ExecutionContext,): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }

    request.user = await this.validateToken(request.headers.authorization);
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];
    const key = await process.env.JWT_SECRET;
    try {
      const decoded: any = await jwt.verify(token, key);
      console.log(decoded);
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

}
