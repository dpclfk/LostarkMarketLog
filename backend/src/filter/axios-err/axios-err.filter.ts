import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';

@Catch(AxiosError)
export class AxiosErrFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.error(exception.message);
    response.status(400).json({
      statusCode: 400,
      message: '외부 API와 통신중 오류가 발생하였습니다. 값을 확인해 주세요',
    });
  }
}
