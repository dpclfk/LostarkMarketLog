import { Injectable } from '@nestjs/common';
import { CreateItemDto, ItemCheckDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from 'src/schema/item.schema';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}

  async check(itemCheckDto: ItemCheckDto) {
    console.log(itemCheckDto);
    return itemCheckDto;
  }

  async create(createItemDto: CreateItemDto) {
    return 'create ok';
  }

  findAll(QT: string) {
    return `This action returns all item${QT}`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
