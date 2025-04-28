import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto, ItemCheckDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from 'src/schema/item.schema';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ItemSearchService } from 'src/item-search/item-search.service';

export interface ItemSearchParams {
  name: string;
  autcions: boolean;
  category: number;
}

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private configService: ConfigService,
    private itemsearch: ItemSearchService,
  ) {}

  async check(itemCheckDto: ItemCheckDto) {
    const itemcheck = await this.itemsearch.itemCheck(itemCheckDto);
    if (itemcheck.length < 1) {
      throw new BadRequestException('존재하지 않는 아이템입니다.');
    } else {
      return itemcheck;
    }
  }

  async create(createItemDto: CreateItemDto) {
    const lostlink = axios.create({
      baseURL: 'https://developer-lostark.game.onstove.com/',
      headers: {
        accept: 'application/json',
        authorization: `${this.configService.get<string>(`LOSTAPI`)}`,
      },
    });
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
