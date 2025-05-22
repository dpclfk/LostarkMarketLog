import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception/http-exception.filter';
import { MongoErrFilter } from './filter/mongo-err/mongo-err.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AxiosErrFilter } from './filter/axios-err/axios-err.filter';
import { AwsErrFilter } from './filter/aws-err/aws-err.filter';
import { MysqlErrFilter } from './filter/mysql-err/mysql-err.filter';
import { TypeErrFilter } from './filter/type-err/type-err.filter';
import cookieParser from 'cookie-parser';
import { JwtErrFilter } from './filter/jwt-err/jwt-err.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // mongoose.set('debug', true); // mongoose 로그

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT');

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
    new JwtErrFilter(),
  );

  // 리프레시토큰을 쿠키에 저장하기위해 사용
  app.use(cookieParser(process.env.COOKIE_SECRET));

  app.setGlobalPrefix('api');

  // swagger 관련
  const options = new DocumentBuilder()
    .setTitle('lostark market Log API')
    .setDescription('로스트아크 마켓 로그 API 명세서입니다.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apiDocs', app, document);

  app.enableCors({
    origin: 'http://localhost:3701',
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
