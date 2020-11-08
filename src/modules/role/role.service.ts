import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ReadRoleDto, CreateRoleDto, UpdateRoleDto } from './dtos';
import { plainToClass } from 'class-transformer';
import { Rol } from './Rol.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository,
    ) { }

    async get(id: number): Promise<ReadRoleDto> {
        if (!id) {
            throw new BadRequestException('id must be sent');
        }

        const role: Rol = await this._roleRepository.findOne(id, {
            where: { status: 'ACTIVE' },
        });

        if (!role) {
            throw new NotFoundException();
        }

        return plainToClass(ReadRoleDto, role);
    }

    async getAll(type:string): Promise<ReadRoleDto[]> {
        const roles: Rol[] = await this._roleRepository.find({
            where: { status: type },
        });
        console.log(roles);
        return roles.map(role => plainToClass(ReadRoleDto, role));
    }

    async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
        const savedRole: Rol = await this._roleRepository.save(role);
        return plainToClass(ReadRoleDto, savedRole);
    }

    async update(id: number, role: Partial<UpdateRoleDto>): Promise<ReadRoleDto> {
        const updatedRole = await this._roleRepository.update(id, role);
        return plainToClass(ReadRoleDto, updatedRole);
    }

    async delete(id: number): Promise<void> {
        const roleExists = await this._roleRepository.findOne(id, {
            where: { status: 'ACTIVE' },
        });

        if (!roleExists) {
            throw new NotFoundException();
        }

        await this._roleRepository.update(id, { status: 'INACTIVE' });
    }
}
