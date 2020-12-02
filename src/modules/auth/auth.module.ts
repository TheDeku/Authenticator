import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '../../config/config.module';
import { Configuration } from '../../config/config.keys';
import { global } from '../../shared/global'
import { GoogleStrategy } from './strategies/google-strategy';
import * as config from 'config';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRepository]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(){
        return{
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: 3600,
          }
        }
      }
    }),HttpModule
  ],

  controllers: [AuthController],
  providers: [AuthService, ConfigService, JwtStrategy,GoogleStrategy],
  exports: [JwtStrategy, PassportModule,GoogleStrategy],
})
export class AuthModule {}
