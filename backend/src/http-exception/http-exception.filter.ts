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
    const status = exception.getStatus();
    const errMessage = exception.getResponse() as {
      message: string | string[];
      statusCode: number;
      error: string;
    };
    response.status(status).json({
      statusCode: status,
      data: errMessage.message,
    });

    console.log(status, errMessage);
  }
}
