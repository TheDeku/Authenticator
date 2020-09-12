import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() SignupDto: SignupDto): Promise<void> {
    return this._authService.signup(SignupDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() SigninDto: SigninDto) {
    return this._authService.signin(SigninDto);
  }
}
