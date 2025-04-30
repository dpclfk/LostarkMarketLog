import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ItemSearchService } from 'src/item-search/item-search.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from 'src/schema/item.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from 'src/entities/Market.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Market]),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  providers: [TasksService, ItemSearchService],
})
export class TasksModule {}
