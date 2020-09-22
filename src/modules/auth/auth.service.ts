import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import md5 from 'md5-hash';
import { User } from '../user/user.entity';
import { AuthRepository } from './auth.repository';
import { SigninDto, SignupDto } from './dto';
import { IJwtPayLoad } from './jwt-payload.interface';
import { RoleType } from '../role/roletype.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ) { }

  async signup(signupDto: SignupDto): Promise<any> {
    const { username, email } = signupDto;
    const userExists = await this._authRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExists) {
      throw new ConflictException('username or email already exists');
    }

    return this._authRepository.signup(signupDto);
  }



  async activate(signupDto: SignupDto): Promise<any> {
    const { username, email } = signupDto;
    const userExists = await this._authRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExists) {
      throw new ConflictException('username or email already exists');
    }

    return this._authRepository.signup(signupDto);
  }




  async signin(signinDto: SigninDto): Promise<{ token: string }> {
    const { username, password } = signinDto;
    const user: User = await this._authRepository.findOne({
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
      roles: user.roles.map(r => r.name as RoleType),
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
}
