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
import { getAllItemsDto, resItemDto } from './dto/res-item.dto';

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
    const itemcheck: {
      name: string;
      icon: string;
    }[] = await this.itemsearch.itemCheck(itemCheckDto);
    if (itemcheck.length < 1) {
      throw new BadRequestException('존재하지 않는 아이템입니다.');
    } else {
      return itemcheck;
    }
  }

  async create(createItemDto: CreateItemDto) {
    await this.s3UploadService.s3Upload(createItemDto.icon, createItemDto.name);
    if (createItemDto.itemCode) {
      // itemCode있을때, 즉 market일때
      // auctions는 아이템 코드가 없음
      if (createItemDto.auctions === true) {
        throw new BadRequestException('잘못된 생성입니다.');
      }

      const itemValidation: string = await this.itemsearch.itemCodeSearch(
        createItemDto.itemCode,
      );
      if (itemValidation !== createItemDto.name) {
        throw new BadRequestException('아이템 이름이 다릅니다.');
      }
      const itemSave: Market = this.marketRepository.create({
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
      const itemValidation: { name: string; icon: string }[] =
        await this.itemsearch.itemCheck(createItemDto);
      if (itemValidation[0].name !== createItemDto.name) {
        throw new BadRequestException('아이템 이름이 다릅니다.');
      }
      const itemSave: Market = this.marketRepository.create({
        name: createItemDto.name,
        auctions: true,
        category: createItemDto.category,
      });
      await this.marketRepository.save(itemSave);
    }
    // 최초 시도시 mongoDB에 1번 저장함
    const nowCreate: Market = await this.marketRepository.findOne({
      where: { name: createItemDto.name },
    });
    const price: {
      name: string;
      price: any;
    } = await this.itemsearch.priceSearch(nowCreate);
    const createdItem: ItemDocument = new this.itemModel({
      name: price.name,
      price: price.price || 0,
      comment: `최초 시도시 자동으로 1회 저장됩니다.`,
    });
    await createdItem.save();

    return 'create ok';
  }

  async findAll() {
    // DB에있는 모든 값을 가져옴
    const findAllItem: Market[] = await this.marketRepository.find();

    // 가져온 아이템들의 최신가격을 mongoDB에서 불러옴
    const findAllLastPrice: getAllItemsDto[] = await Promise.all(
      findAllItem.map(async (item) => {
        const mongoFindAll: Item = await this.itemModel
          .findOne({ name: item.name })
          .sort({ createdAt: -1 })
          .lean();
        return {
          id: item.id,
          name: mongoFindAll.name,
          price: mongoFindAll.price,
          comment: mongoFindAll.comment,
          icon: `https://${this.configService.get('AWS_S3_BUCKET')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${mongoFindAll.name}`,
          date: mongoFindAll.createdAt,
        };
      }),
    );
    return findAllLastPrice;
  }

  async findOne(id: number) {
    // 문자 들어왔을때 에러 내보내게
    if (Number.isNaN(id)) {
      throw new BadRequestException('숫자만 넣어주세요');
    }
    const findItem: Market = await this.marketRepository.findOne({
      where: { id: id },
    });

    const mongoFindAll: Item[] = await this.itemModel
      .find({ name: findItem.name })
      .sort({ createdAt: -1 });

    const findItemPrice: resItemDto[] = mongoFindAll.map((item) => {
      return {
        price: item.price,
        comment: item.comment,
        date: item.createdAt,
      };
    });

    console.log(findItemPrice);

    return {
      name: findItem.name,
      item: findItemPrice,
      icon: `https://${this.configService.get('AWS_S3_BUCKET')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${findItem.name}`,
    };
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    // 문자 들어왔을때 에러 내보내게
    if (Number.isNaN(id)) {
      throw new BadRequestException('숫자만 넣어주세요');
    }

    // 업데이트니까 id 없어도 db에는 변화 없음
    await this.marketRepository.update(id, updateItemDto);

    // 만약 id가 없다면 변화가 없었으니 없다고 출력
    // 이미지만 변환할 가능성이 있어서 이렇게함(이미지는 DB에 저장을 안하고 name값으로만 저장함)
    const findItem: Market = await this.marketRepository.findOne({
      where: { id: id },
    });
    if (!findItem) {
      throw new BadRequestException('해당 id는 없는 id 입니다.');
    }
    // 이미지에 변화있으면 새로운 이미지로 변경
    if (updateItemDto.icon) {
      await this.s3UploadService.s3Upload(updateItemDto.icon, findItem.name);
    }

    return '변경이 완료되었습니다.';
  }

  async remove(id: number) {
    // 문자 들어왔을때 에러 내보내게
    if (Number.isNaN(id)) {
      throw new BadRequestException('숫자만 넣어주세요');
    }
    const findItem: Market = await this.marketRepository.findOne({
      where: { id: id },
    });

    await this.marketRepository.delete({ id: id });
    return `${findItem.name} 아이템을 삭제하였습니다.`;
  }
}
