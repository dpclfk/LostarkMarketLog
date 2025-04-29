import { S3ServiceException } from '@aws-sdk/client-s3';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(S3ServiceException)
export class AwsErrFilter implements ExceptionFilter {
  catch(exception: S3ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception.$metadata?.httpStatusCode || HttpStatus.BAD_REQUEST;

    response.status(400).json({
      statusCode: 400,
      message: 'S3 업로드 중 문제가 발생하였습니다.',
    });
  }
}
