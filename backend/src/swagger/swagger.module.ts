import { Module } from '@nestjs/common';
import { SwaggerDocumentationService } from './swagger-documentation.service';

@Module({
  providers: [SwaggerDocumentationService],
  exports: [SwaggerDocumentationService]
})
export class SwaggerModule {}