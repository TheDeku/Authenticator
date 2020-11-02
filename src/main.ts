
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './config/config.keys';
import { registerWithEureka } from './eureka-helper';

async function bootstrap() {
  const logger = new Logger('AuthService');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //  /api/endpointName

  await app.listen(AppModule.port);
  registerWithEureka("auth", parseInt(AppModule.port));

  
  //registerWithEureka("auth", parseInt(AppModule.port));

  logger.verbose(`Version: ${environment.appVersion}`)
  logger.verbose(`Description: ${environment.appDescription}`)
  logger.verbose(`Author: ${environment.appAuthor}`)
  logger.verbose(`Application listening on port: ${AppModule.port}`)
}
bootstrap();
