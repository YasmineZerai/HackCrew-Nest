import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { zodPipeType } from '../enums/enum';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(
    private schema: ZodSchema,
    private type: zodPipeType,
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const result = this.schema.safeParse(value);
    console.log(result);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.') || 'body',
        message: err.message,
        code: err.code,
      }));

      const errorResponse = {
        statusCode: 400,
        message: 'Validation failed',
        errors,
        timestamp: new Date().toISOString(),
      };

      throw this.type === zodPipeType.WS
        ? new WsException(errorResponse)
        : new BadRequestException(errorResponse);
    }

    return result.data;
  }
}
