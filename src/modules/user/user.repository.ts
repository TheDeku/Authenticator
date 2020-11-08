
import { Repository, EntityRepository } from 'typeorm';
import { Usuario } from './Usuario.entity';
import { UsuDet } from './UsuDet.entity';


@EntityRepository(Usuario)
export class UserRepository extends Repository<Usuario> {

}

@EntityRepository(UsuDet)
export class UserDetRepository extends Repository<UsuDet> {

}