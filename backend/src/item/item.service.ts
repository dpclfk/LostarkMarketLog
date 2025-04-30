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
import { DateTime } from 'luxon';

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
      if (createItemDto.auctions === true) {
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
      if (createItemDto.auctions === false) {
        throw new BadRequestException('잘못된 생성입니다.');
      }
      const itemSave = this.marketRepository.create({
        name: createItemDto.name,
        auctions: true,
        category: createItemDto.category,
      });
      await this.marketRepository.save(itemSave);
    }
    // 최초 시도시 mongoDB에 1번 저장함
    const nowCreate = await this.marketRepository.findOne({
      where: { name: createItemDto.name },
    });
    const price = await this.itemsearch.priceSearch(nowCreate);
    const createdItem = new this.itemModel({
      name: price.name,
      price: price.price || 0,
      comment: `최초 시도시 자동으로 1회 저장됩니다.`,
    });
    await createdItem.save();

    return 'create ok';
  }

  async findAll() {
    const findAllItem: Market[] = await this.marketRepository.find();
    const findAllLastPrice = await Promise.all(
      findAllItem.map(async (item) => {
        const mongoFindAll = await this.itemModel
          .findOne({ name: item.name })
          .sort({ createdAt: -1 });

        return {
          name: mongoFindAll.name,
          price: mongoFindAll.price,
          comment: mongoFindAll.comment,
          img: `https://${this.configService.get('AWS_S3_BUCKET')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${mongoFindAll.name}`,
        };
      }),
    );
    return findAllLastPrice;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  async remove(id: number) {
    await this.marketRepository.delete({ id: 1 });
    return `This action removes a #${id} item`;
  }
}
