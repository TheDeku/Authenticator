import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../../shared/shared.module';
import { UserRepository, UserDetRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleRepository } from '../role/role.repository';
import { AuthGuardService } from '../auth/auth.guard';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserRepository,RoleRepository,UserDetRepository]),
      SharedModule, AuthModule, AuthGuardService,HttpModule
      
    ],
    providers: [UserService,],
    controllers: [UserController],
  })
  export class UserModule {}