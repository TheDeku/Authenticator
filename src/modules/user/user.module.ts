import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../../shared/shared.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleRepository } from '../role/role.repository';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserRepository,RoleRepository]),
      SharedModule, AuthModule, AuthGuard,HttpModule
      
    ],
    providers: [UserService,],
    controllers: [UserController],
  })
  export class UserModule {}