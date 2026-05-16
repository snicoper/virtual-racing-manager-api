import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProblemDetailsResponse } from '../interfaces/problem-details-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;

    const body =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as Record<string, unknown>)
        : {};

    const responseResult: ProblemDetailsResponse = {
      type:
        typeof body.type === 'string'
          ? body.type
          : this.getDefaultBodyType(status),
      title:
        typeof body.title === 'string'
          ? body.title
          : this.getDefaultTitle(status),
      status,
      detail:
        typeof body.detail === 'string'
          ? body.detail
          : typeof body.message === 'string'
            ? body.message
            : isHttpException
              ? exception.message
              : 'Internal server error',
      instance: request.url,
      code:
        typeof body.code === 'string' ? body.code : this.getDefaultCode(status),
      errors: this.isValidationErrors(body.errors) ? body.errors : undefined,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseResult);
  }

  private isValidationErrors(
    value: unknown,
  ): value is Record<string, string[]> {
    return (
      typeof value === 'object' &&
      value !== null &&
      Object.values(value).every(
        (item) =>
          Array.isArray(item) &&
          item.every((message) => typeof message === 'string'),
      )
    );
  }

  private getDefaultTitle(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'The specified resource was not found';
      case 409:
        return 'Conflict';
      default:
        return 'An error occurred while processing your request';
    }
  }

  private getDefaultCode(status: number): string {
    switch (status) {
      case 400:
        return 'bad_request';
      case 401:
        return 'unauthorized';
      case 403:
        return 'forbidden';
      case 404:
        return 'not_found';
      case 409:
        return 'conflict';
      default:
        return 'internal_server_error';
    }
  }

  private getDefaultBodyType(status: number): string {
    switch (status) {
      case 400:
        return 'https://tools.ietf.org/html/rfc7231#section-6.5.1';
      case 401:
        return 'https://tools.ietf.org/html/rfc7235#section-3.1';
      case 403:
        return 'https://tools.ietf.org/html/rfc7231#section-6.5.3';
      case 404:
        return 'https://tools.ietf.org/html/rfc7231#section-6.5.4';
      case 409:
        return 'https://tools.ietf.org/html/rfc7231#section-6.5.8';
      default:
        return 'https://tools.ietf.org/html/rfc7231#section-6.6.1';
    }
  }
}
