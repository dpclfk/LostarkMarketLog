import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errMessage = exception.getResponse() as {
      message: string | string[];
      statusCode: number;
      error: string;
    };
    console.error(errMessage.message);
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: errMessage.message,
    });
  }
}
