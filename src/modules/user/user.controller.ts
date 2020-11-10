import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards, UsePipes, ValidationPipe, Res
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../role/decorators/role.decorators';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../../modules/role/roletype.enum';
import { ReadUserDto } from './dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserDetailDto } from './dto/user-detail.dto';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  @Roles(RoleType.ADMIN)
  @UseGuards(new AuthGuard(), RoleGuard)
  getUser(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
    return this._userService.get(id);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(new AuthGuard(), RoleGuard)
  @Post()
  getUsers(@Body() query: any) {

    return this._userService.getAll(query);
  }

  @Patch('update')
  @Roles(RoleType.USUARIO)
  @UseGuards(new AuthGuard(), RoleGuard)
  updateUser(@Body() user: Partial<ReadUserDto>,) {
    console.log(user);
    return this._userService.update(user.id,user);
  }

  @Delete(':id')
  @Roles(RoleType.USUARIO)
  @UseGuards(new AuthGuard(), RoleGuard)
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this._userService.delete(id);
  }

  @Post('setRole/:userId/:roleId')
  @Roles(RoleType.ADMIN)
  @UseGuards(new AuthGuard(), RoleGuard)
  setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<boolean> {
    return this._userService.setRoleToUser(userId, roleId);
  }


  @Post('updetail')
  @UsePipes(ValidationPipe)
  async updateUserDet(@Body() userDetail: UserDetailDto,@Res() response) {

    let status = await this._userService.updateDetail(userDetail);
    response.status(status.code).json(status);
  }


  @Post('/forget')
  @UsePipes(ValidationPipe)
  async restore(@Body() email: string) {
    let response;
    await this._userService.forget(email).then(data =>{
      response = {message:'Se ha enviado un codigo de validación a su correo',status:true};
    }).catch(err =>{
      err = {message: err.message,status:false,code:err.status};
      response = err;
    })
    return  response;
  }

  @Post('/validate')
  @UsePipes(ValidationPipe)
  async validatePin(@Body() restore: number,email:string) {
    let response;
    await this._userService.validatePin(restore,email).then(data =>{
      response = { message:'Continue para cambiar su contraseña',status:true};
    }).catch(err =>{
      err = {message: err.message, status:false, code:err.status};
      response = err;
    })
    return  response;
  }


  @Post('/restore')
  @UsePipes(ValidationPipe)
  async newPassword(@Body() data) {
    let response;

    await this._userService.newPassword(data).then(data =>{
      response = { message:'Se cambio la contraseña correctamente',status:true};
    }).catch(err =>{
      err = {message: err.message, status:false, code:err.status};
      response = err;
    })
    return  response;
  }
}