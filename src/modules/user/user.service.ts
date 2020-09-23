import {
  Injectable,
  BadRequestException,
  NotFoundException, ConflictException
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RoleRepository } from '../role/role.repository';
import { status } from '../../shared/entity-status.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { plainToClass } from 'class-transformer';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {

 
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) { }

  async get(id: number): Promise<ReadUserDto> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const user: User = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return plainToClass(ReadUserDto, user);
  }

  async getAll(): Promise<ReadUserDto[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });

    return users.map(user => plainToClass(ReadUserDto, user));
  }

  async update(id: number, user: Partial<UpdateUserDto>): Promise<ReadUserDto> {
    const updatedsUser = await this._userRepository.update(id, user);
    return plainToClass(ReadUserDto, updatedsUser);
  }

  async delete(id: number): Promise<void> {
    const userExist = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!userExist) {
      throw new NotFoundException();
    }

    await this._userRepository.update(id, { status: 'INACTIVE' });
  }

  async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
    const userExist = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!userExist) {
      throw new NotFoundException();
    }

    const roleExist = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });

    if (!roleExist) {
      throw new NotFoundException('Role does not exist');
    }

    userExist.roles.push(roleExist);
    await this._userRepository.save(userExist);

    return true;
  }


  async forget(email: string): Promise<any> {
   
    const user = await this._userRepository.findOne(email,{
      where: { email: email },
    });
 

    if (!user) {
      throw new ConflictException('Email entered does not exist');
    }else{
      let pin = Math.floor(Math.random() * (9999 - 1234 + 1) + 1234)

      user.restore = pin;

      return await (await this._userRepository.save(user)).restore;
    }


  }

  async validatePin(restore: number, email: string) {
    console.log(restore);
    const user = await this._userRepository.findOne(restore,{
      where: { restore: restore, email: email },
    });
  

    if (!user) {
      throw new ConflictException('Pin invalid');
    }else{
      user.restore = null;

      return await this._userRepository.save(user);
    }
  }


  newPassword = async (data) => {
   console.log(data);
    const user = await this._userRepository.findOne({
      where: { email: data.email}
    });

    if (!user) {
      throw new ConflictException('No se pudo restablecer la contraseña');
    }else{
      const salt = await genSalt(10);
      user.password = await hash(data.password, salt);
      return await this._userRepository.save(user);
    }
  }
}