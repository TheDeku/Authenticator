import { genSalt, hash } from "bcryptjs";
import { from } from "rxjs";
import { EntityRepository, getConnection, Repository } from "typeorm";
import { SignupDto } from "./dto";
import { RoleRepository } from "../role/role.repository";
import { RoleType } from "../role/roletype.enum";
import { Usuario } from '../user/Usuario.entity';
import { Rol } from "../role/Rol.entity";

@EntityRepository(Usuario)
export class AuthRepository extends Repository<Usuario> {


  async signup(signupDto: SignupDto)  {
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
          role.status = "WORKER";
          break;
        case RoleType.BODEGA:
          role.nombre = RoleType.BODEGA;
          role.descripcion = "Usuario bodega";
          role.status = "WORKER";
          break;
        case RoleType.CAJERO:
          role.nombre = RoleType.CAJERO;
          role.descripcion = "Usuario caja";
          role.status = "WORKER";
          break;
        case RoleType.CLIENTE:
          role.nombre = RoleType.CLIENTE;
          role.descripcion = "Cliente aplicación";
          role.status = "STANDARD";
          break;
        case RoleType.COCINA:
          role.nombre = RoleType.COCINA;
          role.descripcion = "Usuario cocina";
          role.status = "WORKER";
          break;
        case RoleType.GARZON:
          role.nombre = RoleType.GARZON;
          role.descripcion = "Usuario Garzon";
          role.status = "WORKER";
          break;
        case RoleType.USUARIO:
          role.nombre = RoleType.USUARIO;
          role.descripcion = "Usuario por defecto";
          role.status = "STANDARD";
          break;

        default:
          const data = {
            message: 'Role doest noe exist',
            status: true,
            value:user,
            userCreated:false
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
      let data = {
        message: 'User created succefully',
        status: true,
        value:user,
        userCreated:true
      }
    
      return data;
    } catch (error) {
      console.log(error)
      const data = {
        message: "May the force be with you, but this account doesn't ;v",
        status: true,
        value:user,
        userCreated:false
      }



      return data;
    }

  }


}
