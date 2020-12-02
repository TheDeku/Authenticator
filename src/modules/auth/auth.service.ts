import {
  ConflictException,
  HttpService,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcryptjs';
import md5 from 'md5-hash';
import { AuthRepository } from './auth.repository';
import { SigninDto, SignupDto } from './dto';
import { IJwtPayLoad } from './jwt-payload.interface';
import { RoleType } from '../role/roletype.enum';
import { Usuario } from '../user/Usuario.entity';
import { MessagesApi } from '../../shared/messages.api';
import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
    private _http: HttpService
  ) { }

  async signup(signupDto: SignupDto) {
    let message;
    try {

      const { username, email } = signupDto;
      const userExists = await this._authRepository.findOne({
        where: [{ username }, { email }],
      });

      if (userExists) {
        throw new ConflictException('username or email already exists');
      }

      let response = await this._authRepository.signup(signupDto);
      //console.log(response);
      if (response.userCreated) {
        let emailJson = {
          title: "Bienvenido querido",
          usernameOrName: response.value.username,
          description: "Ingresa a tu cuenta",
          content: "Accede a tu cuenta desde el siguiente link",
          type: "NEW_USER",
          emailToSend: response.value.email
        }

        console.log(process.env.MAIL_ENDPOINT);
        await this._http.post(`${process.env.MAIL_ENDPOINT}`, emailJson).toPromise().then(resp => { console.log(resp); }).catch(err => { console.log(err); });
        response.value.password = undefined;
        message = new MessagesApi(response.message, response.status, HttpStatus.CREATED, response.value);
      } else {
        message = new MessagesApi(response.message, false, HttpStatus.NOT_ACCEPTABLE, response.value);
      }



    } catch (error) {
      message = new MessagesApi("Error en la petición", false, HttpStatus.BAD_REQUEST, error);
    }
    return message;

  }

  async signin(signinDto: SigninDto): Promise<{ token: string }> {
    const { username, password } = signinDto;
    const user: Usuario = await this._authRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    console.log(password)

    const isMatch = await compare(password, user.password);
    //const passwordMd5 =  md5( password );
    if (!isMatch) {
      throw new UnauthorizedException('invalid credentials');
    }



    const payload: IJwtPayLoad = {
      id: user.id,
      email: user.email,
      username: user.username,
      isGoogle: false,
      roles: user.roles.map(r => r.nombre as RoleType),
    };

    const token = await this._jwtService.sign(payload);
    const data = {
      token: token,
      message: 'OK',
      status: true
    }
    return data;
    // return { token };
  }


  async googleLogin(req) {
    console.log(req.user.data._json);
    let dataUser = req.user.data._json;
    if (!req.user) {
      return 'No user from google';
    }

    const emailFromGoogle = dataUser.email;

    const user: Usuario = await this._authRepository.findOne({
      where: { email: emailFromGoogle, status: 'ACTIVE' },
    });

    if (!user) {
      const user: Usuario = await this._authRepository.findOne({
        where: { email: emailFromGoogle, status: 'INACTIVE' },
      });

      const data = {
        message: 'Usuario no encontrado',
        status: false
      }
      return data;
      // return await this.checkUserInactive(user, true);
    } else {
      const payload: IJwtPayLoad = {
        id: user.id,
        email: user.email,
        username: user.username,
        isGoogle: true,
        roles: user.roles.map(r => r.nombre as RoleType),
        googleData: req.user.data._json
      };

      const token = await this._jwtService.sign(payload);
      const data = {
        token: token,
        message: 'OK',
        status: true
      }
      return data;
    }

  }

}
