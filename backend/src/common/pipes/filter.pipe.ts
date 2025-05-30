// src/common/pipes/filter.pipe.ts
import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class FilterPipe implements PipeTransform {

    async transform(value: any, meta: ArgumentMetadata) {
        const { metatype, type, data } = meta;

        if (!metatype || metatype === Object) {
            return value;
        }

        const obj = plainToInstance(metatype, value);

        const errors = await validate(obj, {
            whitelist: true,
            forbidNonWhitelisted: false,
        });

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        return obj;
    }
}
