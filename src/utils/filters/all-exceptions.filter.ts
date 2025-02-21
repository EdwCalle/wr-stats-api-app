// src/exception-filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
            message: (exception as Error).message || 'Internal Server Error!!!!'
          };
    this.logger.error(
      `[${httpStatus}] ${httpAdapter.getRequestUrl(ctx.getRequest())} - ${
        (exception as Error).message
      }`,
      exception instanceof Error ? exception.stack : 'No stack trace available' //Log the stack if it exists
    );
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
