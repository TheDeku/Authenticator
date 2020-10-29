import { IsString, IsNumber } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadRoleDto } from '../../role/dtos';

@Exclude()
export class ReadUserDto {
    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsString()
    readonly username: string;

    @Expose()
    @IsString()
    readonly email: string;

    @Expose()
    @Type(type => ReadRoleDto)
    readonly rols: ReadRoleDto[];
}
