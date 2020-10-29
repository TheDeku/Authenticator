import { IsString } from 'class-validator';

export class UpdateRoleDto {
    @IsString()
    readonly nombre: string;

    @IsString()
    readonly descripcion: string;
}