import { genSalt, hash } from "bcryptjs";
import { from } from "rxjs";
import { EntityRepository, getConnection, Repository } from "typeorm";
import { User } from "../user/user.entity";
import { SignupDto } from "./dto";
import  md5  from 'md5-hash';
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

    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.CAJERO },
    });

    user.roles = [defaultRole];

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();
  }
}
