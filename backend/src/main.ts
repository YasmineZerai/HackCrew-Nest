import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerDocumentationService } from './swagger/swagger-documentation.service';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // or use '*' to allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.use('/uploads', express.static(join(process.cwd(),'uploads')));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const swaggerService = app.get(SwaggerDocumentationService);
  swaggerService.setup(app);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(5000);
}
void bootstrap();
