import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { MongoErrFilter } from './mongo-err/mongo-err.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new MongoErrFilter());

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
