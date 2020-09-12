import { Module } from '@nestjs/common';
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
          secret: global.JWT_SECRET,
          signOptions: {
            expiresIn: 3600,
          }
        }
      }
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, ConfigService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
