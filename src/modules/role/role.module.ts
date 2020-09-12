import { Module } from '@nestjs/common';

import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
    imports: [TypeOrmModule.forFeature([RoleRepository])],
    providers: [RoleService],
    controllers: [RoleController],
})
export class RoleModule { }
