import {
  Injectable,
  BadRequestException,
  NotFoundException, ConflictException, HttpService
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '../role/role.repository';
import { status } from '../../shared/entity-status.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { plainToClass } from 'class-transformer';
import { genSalt, hash } from 'bcryptjs';
import { Usuario } from './Usuario.entity';

@Injectable()
export class UserService {

 
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
    private _http:HttpService
  ) { }

  async get(id: number): Promise<ReadUserDto> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const user: Usuario = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return plainToClass(ReadUserDto, user);
  }

  async getAll(): Promise<ReadUserDto[]> {
    const users: Usuario[] = await this._userRepository.find({
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
      let stringPin = String(pin).split("").join(" ");
      console.log(stringPin);
        let emailJson={
          title: "Restablecimiento de contraseña",
          usernameOrName: user.username,
          description: stringPin,
          content: stringPin,
          type: "GENERAL",
          emailToSend: user.email,
          urlImageHeaderMail:"https://images.vexels.com/media/users/3/153503/isolated/preview/82d5effb4641c42771a17d0550ffc60b-icono-de-la-insignia-de-acceso-by-vexels.png",
          urlImageBodyMail:"https://images.vexels.com/media/users/3/153503/isolated/preview/82d5effb4641c42771a17d0550ffc60b-icono-de-la-insignia-de-acceso-by-vexels.png",
          containButton:false
      }

      
        console.log(JSON.stringify(emailJson));
        console.log(process.env.MAIL_ENDPOINT);
        await this._http.post(`${process.env.MAIL_ENDPOINT}`,emailJson).toPromise().then(resp=>{}).catch(err=>{});
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