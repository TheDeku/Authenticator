import {
  Injectable,
  BadRequestException,
  NotFoundException, ConflictException, HttpService
} from '@nestjs/common';
import { UserRepository, UserDetRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '../role/role.repository';
import { status } from '../../shared/entity-status.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { plainToClass } from 'class-transformer';
import { genSalt, hash } from 'bcryptjs';
import { Usuario } from './Usuario.entity';
import { UsuDet } from './UsuDet.entity';
import { Rol } from '../role/Rol.entity';
import { JoinColumn } from 'typeorm';
import { UserDetailDto } from './dto/user-detail.dto';
import { MessagesApi } from 'src/shared/messages.api';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {


  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
    @InjectRepository(UserDetRepository)
    private readonly _userDetRepository: UserDetRepository,
    private _http: HttpService
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

  async getByMail(mail: string): Promise<ReadUserDto> {
    if (!mail) {
      throw new BadRequestException('id must be sent');
    }

    const user: Usuario = await this._userRepository.findOne(mail, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return plainToClass(ReadUserDto, user);
  }

  async getAll(query: any) {
    console.log(query);
    let users;
    let role
    if (Object.keys(query).length === 0) {
      users = await this._userRepository.find({ where: { status: status.ACTIVE }, relations: ['usuDet'] },);
      let sendUsers = [];
      await Promise.all(users.map(user => {
        user.password = undefined;
        if (user.usuDet === null) {
          user.usuDet = new UsuDet();
        }
        for (let index = 0; index < user.roles.length; index++) {
          const element = user.roles[index];

          if (element.nombre === 'USUARIO') {
            user.roles.splice(index, 1);
          }
        }
        if (user.roles[0].nombre != "CLIENTE") {
          sendUsers.push(user);
        }

      }))
      return sendUsers;
    } else {
      role = await this._roleRepository.findOne({ where: { nombre: query.role } });
      users = await this._userRepository.find({ where: { status: status.ACTIVE } });
      await Promise.all(users.map(async user => {
        user.usuDet = await this._userDetRepository.findOne({
          where: { id: user.usuDetId },
        });
        if (user.usuDet === undefined) {
          user.usuDet = new UsuDet();
        }
        user.password = undefined
        await Promise.all(user.roles.map(rol => {
          if (rol.nombre === 'USUARIO') {
            rol = undefined;
          } else {
            user.roles = [];
            user.roles.push(rol);
          }
        }))
      }))

      let userToResponse = [];
      await Promise.all(users.map(async user => {
        await Promise.all(user.roles.map(rol => {
          if (rol.nombre === role.nombre) {
            userToResponse.push(user);
          }
        }))
      }));
      if (query.size != 0) {
        return this.paginate(userToResponse, query.size, query.number);
      } else {
        return userToResponse;
      }

    }

  }

  paginate(array, page_size = 5, page_number = 1) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  async update(id: number, user: Partial<UpdateUserDto>): Promise<ReadUserDto> {
    const updatedsUser = await this._userRepository.update(id, user);
    return plainToClass(ReadUserDto, updatedsUser);
  }

  async updateDetail(userDetail: UserDetailDto) {
    let message;
    try {
      let result = plainToClass(UsuDet, userDetail)

      let exist = await this._userDetRepository.findOne({ where: { usuarioId: result.usuarioId } });

      if (exist != undefined) {
        result.usuarioId = undefined;
        result.id = exist.id;

        await this._userDetRepository.save(result).then(async resp => {
          resp.usuarioId = exist.usuarioId;
          message = new MessagesApi("Informacion Actualizada", true, HttpStatus.ACCEPTED, resp)
          let result = await this._userRepository.findOne(resp.usuarioId);
          result.usuDetId = resp.id
          await this._userRepository.save(result);
        }).catch(err => {
          message = new MessagesApi("Información no puedo ser actualizada", true, HttpStatus.NOT_ACCEPTABLE, err)
        });
      } else {
        await this._userDetRepository.save(result).then(async resp => {
          message = new MessagesApi("Informacion Actualizada", true, HttpStatus.ACCEPTED, resp)
          let result = await this._userRepository.findOne(resp.usuarioId);
          console.log(result);
          result.usuDetId = resp.id
          await this._userRepository.save(result);
        }).catch(err => {
          message = new MessagesApi("Información no puedo ser actualizada", true, HttpStatus.NOT_ACCEPTABLE, err)
        });
      }


    } catch (error) {
      console.log(error);
      message = new MessagesApi("Hubo un problema en la solicitud", true, HttpStatus.BAD_REQUEST, error)
    }


    return message;
  }

  async delete(id: number) {
    console.log(id);
    let message;
    const userExist = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!userExist) {
      throw new NotFoundException();
    }

    await this._userRepository.update(id, { status: 'INACTIVE' }).then(resp=>{
      console.log(resp);
      if (resp.raw.protocol41) {
        message = {message:"User has been deleted",status:true}
      }
    });

    return message;
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

    const user = await this._userRepository.findOne(email, {
      where: { email: email },
    });


    if (!user) {
      throw new ConflictException('Email entered does not exist');
    } else {
      let pin = Math.floor(Math.random() * (9999 - 1234 + 1) + 1234)

      user.restore = pin;
      let stringPin = String(pin).split("").join(" ");
      console.log(stringPin);
      let emailJson = {
        title: "Restablecimiento de contraseña",
        usernameOrName: user.username,
        description: stringPin,
        content: stringPin,
        type: "GENERAL",
        emailToSend: user.email,
        urlImageHeaderMail: "https://images.vexels.com/media/users/3/153503/isolated/preview/82d5effb4641c42771a17d0550ffc60b-icono-de-la-insignia-de-acceso-by-vexels.png",
        urlImageBodyMail: "https://images.vexels.com/media/users/3/153503/isolated/preview/82d5effb4641c42771a17d0550ffc60b-icono-de-la-insignia-de-acceso-by-vexels.png",
        containButton: false
      }


      //console.log(JSON.stringify(emailJson));
      console.log(process.env.MAIL_ENDPOINT);
      await this._http.post(`${process.env.MAIL_ENDPOINT}`, emailJson).toPromise().then(resp => { }).catch(err => { });
      return await (await this._userRepository.save(user)).restore;
    }


  }

  async validatePin(restore: number, email: string) {
    //console.log(restore);
    const user = await this._userRepository.findOne(restore, {
      where: { restore: restore, email: email },
    });


    if (!user) {
      throw new ConflictException('Pin invalid');
    } else {
      user.restore = null;

      return await this._userRepository.save(user);
    }
  }


  newPassword = async (data) => {
    console.log(data);
    const user = await this._userRepository.findOne({
      where: { email: data.email }
    });

    if (!user) {
      throw new ConflictException('No se pudo restablecer la contraseña');
    } else {
      const salt = await genSalt(10);
      user.password = await hash(data.password, salt);
      return await this._userRepository.save(user);
    }
  }
}