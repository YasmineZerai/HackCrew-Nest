import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { zodPipeType } from '../enums/enum';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(
    private schema: ZodSchema,
    private type: zodPipeType,
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      console.log('try');
      return this.schema.parse(value);
    } catch (error) {
      console.log(error);
      const errors = error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      console.log(errors);
      throw this.type == zodPipeType.WS
        ? new WsException(errors)
        : new BadRequestException(errors);
    }
  }
}
