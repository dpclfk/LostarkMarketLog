import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class MysqlErrFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.error(exception.message);

    const message = { message: 'mySQL Query 오류입니다.' };

    if (exception.message.includes('Duplicate entry')) {
      message.message = '중복된 값 입니다.';
    }
    response.status(400).json({
      statusCode: 400,
      message: message.message,
    });
  }
}
