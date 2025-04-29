import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto, ItemCheckDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from 'src/schema/item.schema';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ItemSearchService } from 'src/item-search/item-search.service';
import { S3UploadService } from 'src/s3-upload/s3-upload.service';
import { Repository } from 'typeorm';
import { Market } from 'src/entities/Market.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface ItemSearchParams {
  name: string;
  autcions: boolean;
  category: number;
}

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    private configService: ConfigService,
    private itemsearch: ItemSearchService,
    private s3UploadService: S3UploadService,
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
    const s3upload = await this.s3UploadService.s3Upload(
      createItemDto.icon,
      createItemDto.name,
    );
    if (createItemDto.itemCode) {
      // itemCode있을때, 즉 market일때
      // auctions는 아이템 코드가 없음
      if (createItemDto.autcions === true) {
        throw new BadRequestException('잘못된 생성입니다.');
      }
      const itemSave = this.marketRepository.create({
        name: createItemDto.name,
        itemCode: createItemDto.itemCode,
        auctions: false,
        category: createItemDto.category,
      });
      await this.marketRepository.save(itemSave);
    } else {
      if (createItemDto.autcions === false) {
        throw new BadRequestException('잘못된 생성입니다.');
      }
      const itemSave = this.marketRepository.create({
        name: createItemDto.name,
        auctions: true,
        category: createItemDto.category,
      });
      await this.marketRepository.save(itemSave);
    }
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
