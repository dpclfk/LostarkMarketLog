import { Module } from '@nestjs/common';
import { ItemModule } from './item/item.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeormConfig } from './config/typeORM.config';
import { User } from './entities/User.entity';
import { Market } from './entities/Market.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from './config/mongo.config';
import { Item, ItemSchema } from './schema/item.schema';
import { ItemSearchService } from './item-search/item-search.service';
import { S3UploadService } from './s3-upload/s3-upload.service';

@Module({
  imports: [
    ItemModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/../.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormConfig,
    }),
    TypeOrmModule.forFeature([User, Market]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: MongoConfig,
    }),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  controllers: [],
  providers: [ItemSearchService, S3UploadService],
})
export class AppModule {}
