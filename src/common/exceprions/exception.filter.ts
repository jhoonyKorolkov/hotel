import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const code =
      errorResponse && typeof errorResponse === 'object' && (errorResponse as any).statusCode
        ? (errorResponse as any).statusCode
        : status;

    response.status(status).json({
      timestamp: new Date().toISOString(),
      status: 'fail',
      data: errorResponse,
      code: code,
    });
  }
}
