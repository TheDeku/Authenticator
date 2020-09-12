import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Roles } from '../role/decorators/role.decorators';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../../modules/role/roletype.enum';
import { ReadUserDto } from './dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  @Roles(RoleType.ADMINISTRATOR)
  @UseGuards(new AuthGuard(), RoleGuard)
  getUser(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
    return this._userService.get(id);
  }

  @Roles(RoleType.ADMINISTRATOR, RoleType.CAJERO)
  @UseGuards(new AuthGuard(), RoleGuard)
  @Get()
  getUsers(): Promise<ReadUserDto[]> {
    return this._userService.getAll();
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: Partial<ReadUserDto>,
  ) {
    return this._userService.update(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this._userService.delete(id);
  }

  @Post('setRole/:userId/:roleId')
  setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<boolean> {
    return this._userService.setRoleToUser(userId, roleId);
  }
}