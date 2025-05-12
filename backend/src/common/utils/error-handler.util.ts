import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export class ErrorHandler {
  static handleError(error: unknown): never {
    // Known NestJS HTTP exceptions
    if (error instanceof HttpException) {
      throw error;
    }

    // TypeORM errors
    if (error instanceof QueryFailedError) {
      if (error.message.includes('Duplicate entry')) {
        throw new ConflictException('Resource already exists');
      }
      throw new InternalServerErrorException('Database operation failed');
    }

    // Generic errors
    if (error instanceof Error) {
      throw new InternalServerErrorException(error.message);
    }

    // Unknown errors
    throw new InternalServerErrorException('An unexpected error occurred');
  }

  static notFound(resourceName: string, id?: number | string): never {
    throw new NotFoundException(
      id
        ? `${resourceName} with ID "${id}" not found`
        : `${resourceName} not found`,
    );
  }

  static conflict(message: string): never {
    throw new ConflictException(message);
  }

  static badRequest(message: string): never {
    throw new BadRequestException(message);
  }

  static unauthorized(message: string): never {
    throw new UnauthorizedException(message);
  }

  static forbidden(message: string): never {
    throw new ForbiddenException(message);
  }

  static internalServerError(message?: string): never {
    throw new InternalServerErrorException(message || 'Internal server error');
  }
}
