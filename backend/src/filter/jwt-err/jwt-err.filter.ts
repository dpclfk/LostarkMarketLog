import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { Response } from 'express';

@Catch(JsonWebTokenError)
export class JwtErrFilter implements ExceptionFilter {
  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.error(exception.message);
    response.status(400).json({
      statusCode: 400,
      message: 'JWT값이 올바르지 않습니다.',
    });
  }
}
