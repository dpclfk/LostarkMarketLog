import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { HttpExceptionFilter } from './filter/http-exception/http-exception.filter';
import { MongoErrFilter } from './filter/mongo-err/mongo-err.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AxiosErrFilter } from './filter/axios-err/axios-err.filter';
import { AwsErrFilter } from './filter/aws-err/aws-err.filter';
import { MysqlErrFilter } from './filter/mysql-err/mysql-err.filter';
import { TypeErrFilter } from './filter/type-err/type-err.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // mongoose.set('debug', true); // mongoose 로그
  // dto에서 타입이 잘못되면 안되게 막음
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // 에러 필터 관련
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new AwsErrFilter(),
    new MongoErrFilter(),
    new AxiosErrFilter(),
    new MysqlErrFilter(),
    new TypeErrFilter(),
  );

  // swagger 관련
  const options = new DocumentBuilder()
    .setTitle('lostark calc API')
    .setDescription('로스트아크 계산기 API 명세서입니다.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apiDocs', app, document);

  await app.listen(3000);
}
bootstrap();
