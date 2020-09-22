import { genSalt, hash } from "bcryptjs";
import { from } from "rxjs";
import { EntityRepository, getConnection, Repository } from "typeorm";
import { User } from "../user/user.entity";
import { SignupDto } from "./dto";
import md5 from 'md5-hash';
import { RoleRepository } from "../role/role.repository";
import { Role } from "../role/role.entity";
import { RoleType } from "../role/roletype.enum";

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto;
    const user = new User();
    user.username = username;
    user.email = email;

    const roleRepository: RoleRepository = await getConnection().getRepository(
      Role,
    );

    let defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.USUARIO },
    });

    if (!defaultRole) {
      const role = new Role();
      role.name = RoleType.USUARIO;
      role.description = "Usuario por defecto - sin validacion";
      let createRole = await roleRepository.create(role);
      await createRole.save();
      console.log(createRole);
    }
    let secondaryRole: Role = await roleRepository.findOne({
      where: { name: signupDto.role },
    });
    if (!secondaryRole) {
      const role = new Role();

      switch (signupDto.role) {
        case RoleType.ADMIN:
          role.name = RoleType.ADMIN;
          role.description = "Administrador del sistema";
          break;
        case RoleType.BODEGA:
          role.name = RoleType.BODEGA;
          role.description = "Usuario bodega";
          break;
        case RoleType.CAJERO:
          role.name = RoleType.CAJERO;
          role.description = "Usuario caja";
          break;
        case RoleType.CLIENTE:
          role.name = RoleType.CLIENTE;
          role.description = "Cliente aplicación";
          break;
        case RoleType.COCINA:
          role.name = RoleType.COCINA;
          role.description = "Usuario cocina";
          break;
        case RoleType.GARZON:
          role.name = RoleType.GARZON;
          role.description = "Usuario Garzon";
          break;
        case RoleType.USUARIO:
          role.name = RoleType.USUARIO;
          role.description = "Usuario por defecto - sin validacion";
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
    if (signupDto.role) {
      secondaryRole = await roleRepository.findOne({
        where: { name: signupDto.role },
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
      const data = {
        message: "May the force be with you, but this account doesn't ;v",
        status: true
      }
      return data;
    }

  }
}
