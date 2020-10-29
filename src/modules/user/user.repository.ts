
import { Repository, EntityRepository } from 'typeorm';
import { Usuario } from './Usuario.entity';


@EntityRepository(Usuario)
export class UserRepository extends Repository<Usuario> {

}