import {
  BadRequestException,
  ValidationPipe,
  type ValidationError,
} from '@nestjs/common';
import { type ProblemDetailsResponse } from '../interfaces/problem-details-response.interface';

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,

    exceptionFactory: (
      validationErrors: ValidationError[] = [],
    ): BadRequestException => {
      const errors = validationErrors.reduce<Record<string, string[]>>(
        (acc, error) => {
          acc[error.property] = Object.values(error.constraints ?? {});
          return acc;
        },
        {},
      );

      const errorResponse: ProblemDetailsResponse = {
        title: 'Bad Request',
        detail: 'Validation failed',
        status: 400,
        type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
        code: 'validation_failed',
        errors,
        timestamp: new Date().toISOString(),
      };

      return new BadRequestException(errorResponse);
    },
  });
}
