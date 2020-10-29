import { genSalt, hash } from "bcryptjs";
import { from } from "rxjs";
import { EntityRepository, getConnection, Repository } from "typeorm";
import { SignupDto } from "./dto";
import md5 from 'md5-hash';
import { RoleRepository } from "../role/role.repository";
import { RoleType } from "../role/roletype.enum";
import { Usuario } from '../user/Usuario.entity';
import { Rol } from "../role/Rol.entity";

@EntityRepository(Usuario)
export class AuthRepository extends Repository<Usuario> {
  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto;
    const user = new Usuario();
    user.username = username;
    user.email = email;

    const roleRepository: RoleRepository = await getConnection().getRepository(
      Rol,
    );

    let defaultRole: Rol = await roleRepository.findOne({
      where: { nombre: RoleType.USUARIO },
    });

    if (!defaultRole) {
      const role = new Rol();
      role.nombre = RoleType.USUARIO;
      role.descripcion = "Usuario por defecto";
      let createRole = await roleRepository.create(role);
      await createRole.save();
      console.log(createRole);
    }
    let secondaryRole: Rol = await roleRepository.findOne({
      where: { nombre: signupDto.rol },
    });
    if (!secondaryRole) {
      const role = new Rol();

      switch (signupDto.rol) {
        case RoleType.ADMIN:
          role.nombre = RoleType.ADMIN;
          role.descripcion = "Administrador del sistema";
          break;
        case RoleType.BODEGA:
          role.nombre = RoleType.BODEGA;
          role.descripcion = "Usuario bodega";
          break;
        case RoleType.CAJERO:
          role.nombre = RoleType.CAJERO;
          role.descripcion = "Usuario caja";
          break;
        case RoleType.CLIENTE:
          role.nombre = RoleType.CLIENTE;
          role.descripcion = "Cliente aplicación";
          break;
        case RoleType.COCINA:
          role.nombre = RoleType.COCINA;
          role.descripcion = "Usuario cocina";
          break;
        case RoleType.GARZON:
          role.nombre = RoleType.GARZON;
          role.descripcion = "Usuario Garzon";
          break;
        case RoleType.USUARIO:
          role.nombre = RoleType.USUARIO;
          role.descripcion = "Usuario por defecto";
          break;

        default:
          const data = {
            message: 'Role doest noe exist',
            status: true
          }
          return data;

      }

      let createRole = await roleRepository.create(role);
      await createRole.save();
      console.log(createRole);
    }
    if (signupDto.rol) {
      secondaryRole = await roleRepository.findOne({
        where: { nombre: signupDto.rol },
      });
    }

    user.roles = [defaultRole,secondaryRole];

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    try {
      await user.save();
      const data = {
        message: 'User created succefully',
        status: true
      }
      return data;
    } catch (error) {
      console.log(error)
      const data = {
        message: "May the force be with you, but this account doesn't ;v",
        status: true
      }
      return data;
    }

  }

  async restorePassword(pin:number){
    
  }
}
