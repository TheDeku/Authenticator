import { Repository, EntityRepository } from 'typeorm';
import { Rol } from './Rol.entity';


@EntityRepository(Rol)
export class RoleRepository extends Repository<Rol> { }