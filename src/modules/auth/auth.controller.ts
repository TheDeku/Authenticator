import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { response } from 'express';
import * as config from 'config';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class AuthController {
  constructor(private readonly _authService: AuthService) { }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signupDto: SignupDto, @Res() response) {
    this._authService.signup(signupDto).then(resp => {
      response.status(resp.code).json(resp);
    }).catch(err => {
      response.status(err.code).json(err);
    });


  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() signinDto: SigninDto) {
    return this._authService.signin(signinDto);
  }

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Param('url') url, @Req() req) { }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const data = await this._authService.googleLogin(req)
    return `<html><body><script>window.opener.postMessage('${JSON.stringify(data)}', '${process.env.LOGIN_GOOGLE}')</script></body></html>`;
  }

}
