import { Module } from '@nestjs/common';
import { ItemModule } from './item/item.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeormConfig } from './config/typeORM.config';
import { Users } from './entities/users.entity';
import { Market } from './entities/market.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from './config/mongo.config';
import { Item, ItemSchema } from './schema/item.schema';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppService } from './app.services';

@Module({
  imports: [
    ItemModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `${__dirname}/../.env.${process.env.NODE_ENV}`,
        `${__dirname}/../.env`,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormConfig,
    }),
    TypeOrmModule.forFeature([Users, Market]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: MongoConfig,
    }),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    ScheduleModule.forRoot(),
    TasksModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
