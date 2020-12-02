import { RoleType } from "../role/roletype.enum";

export interface IJwtPayLoad {
    id: number;
    username: string;
    email: string;
    roles: RoleType[];
    isGoogle:boolean;
    mobile?:boolean;
    iat?: Date;
    googleData?:any;
}