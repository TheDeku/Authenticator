import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ReadRoleDto } from './dtos';
import { CreateRoleDto } from './dtos/create-role.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly _roleService: RoleService) { }

    @Get('rol/:id')
    getRole(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDto> {
        return this._roleService.get(id);
    }

    @Get(':type')
    getRoles(@Param('type',) type:string): Promise<ReadRoleDto[]> {
        console.log(type);
        return this._roleService.getAll(type);
    }

    @Post()
    createRole(@Body() role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
        return this._roleService.create(role);
    }

    @Patch(':id')
    updateRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() role: Partial<ReadRoleDto>,
    ) {
        return this._roleService.update(id, role);
    }

    @Delete(':id')
    deleteRole(@Param('id', ParseIntPipe) id: number) {
        return this._roleService.delete(id);
    }
}