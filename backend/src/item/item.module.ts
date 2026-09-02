import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from 'src/schema/item.schema';
import { ItemSearchService } from 'src/item-search/item-search.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from 'src/entities/market.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Market]),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  controllers: [ItemController],
  providers: [ItemService, ItemSearchService, FileUploadService],
})
export class ItemModule {}
