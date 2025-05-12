import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IApiDocumentation } from './api-documentation.interface';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class SwaggerDocumentationService implements IApiDocumentation {
  setup(app: INestApplication, appName?: string): void {
    const config = new DocumentBuilder()
      .setTitle(`HackCrew - ${appName || 'API'}`)
      .setDescription('Web API documentation for HackCrew app')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        withCredentials: true,
      },
    });
  }
}