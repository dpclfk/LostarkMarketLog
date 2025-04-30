import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(TypeError)
export class TypeErrFilter implements ExceptionFilter {
  catch(exception: TypeError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.error(exception.message);

    response.status(400).json({
      statusCode: 400,
      message: '타입이 잘못되었습니다.',
    });
  }
}
