import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './config/config.keys';

import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleService } from './modules/role/role.service';
import { RoleModule } from './modules/role/role.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';



@Global()
@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UserModule, AuthModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: string ;

  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT)
  }
}
