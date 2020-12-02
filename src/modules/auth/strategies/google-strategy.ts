import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    private readonly _jwtService: JwtService,

  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {

    // console.log(profile._json.email);
    // let decode: any;
    // const { id_token } = profile
    // console.log(id_token);
    // decode = this._jwtService.decode(id_token);
    // console.log(decode.email);
    const user = {
      email: profile._json.email,
      data:profile
    };
    return user


  }
}