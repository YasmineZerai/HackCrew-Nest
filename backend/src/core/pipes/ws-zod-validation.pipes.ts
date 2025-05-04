import { Injectable } from '@nestjs/common';
import { ZodPipe } from './zod-validation.pipes';
import { ZodSchema } from 'zod';
import { zodPipeType } from '../enums/enum';

@Injectable()
export class WsZodPipe extends ZodPipe {
  constructor(schema: ZodSchema) {
    super(schema, zodPipeType.WS);
  }
}
