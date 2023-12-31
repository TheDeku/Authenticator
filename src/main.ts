import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './config/config.keys';
import { registerWithEureka } from './eureka-helper';
import * as dotenv from 'dotenv';


async function bootstrap() {
  const logger = new Logger('AuthService');
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  app.enableCors();

  //  /api/endpointName

  console.log(process.env.MAIL_ENDPOINT);

  await app.listen(AppModule.port);
  // registerWithEureka("auth", parseInt(AppModule.port));

  if (process.env.NODE_ENV === "production") {
    registerWithEureka("auth", parseInt(AppModule.port));
  }


  logger.verbose(`Version: ${environment.appVersion}`)
  logger.verbose(`JWT: ${process.env.JWT_SECRET}`)
  logger.verbose(`Description: ${environment.appDescription}`)
  logger.verbose(`Author: ${environment.appAuthor}`)
  logger.verbose(`Application listening on port: ${AppModule.port}`)

  logger.verbose(`mailer url: ${process.env.MAIL_ENDPOINT}`)
}
bootstrap();