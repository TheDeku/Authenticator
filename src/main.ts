import { Options } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { registerWithEureka } from './eureka-helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //  /api/endpointName


  await app.listen(AppModule.port);
  registerWithEureka("auth", parseInt(AppModule.port));
}
bootstrap();
