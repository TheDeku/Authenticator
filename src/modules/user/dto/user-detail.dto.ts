import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

@Expose()
export class UserDetailDto {

    @Expose()
    id: number;

    @Expose()
    @IsString()
    nombre: string;

    @Expose()
    @IsString()
    apellido: string;

    @Expose()
    imagen: string;
    
    @Expose()
    @IsString()
    telefono: string;

    @Expose()
    @IsString()
    direcciN: string;

    @Expose()
    @IsString()
    ciudad: string;

    @Expose()
    @IsString()
    comuna: string;
    @Expose()
    @IsNumber()
    usuarioId: number;
}