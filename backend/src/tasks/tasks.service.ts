import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Market } from 'src/entities/Market.entity';
import { ItemSearchService } from 'src/item-search/item-search.service';
import { Item, ItemDocument } from 'src/schema/item.schema';
import { In, Repository } from 'typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    private itemsearch: ItemSearchService,
  ) {}
  private searchFail: Set<string> = new Set();
  private searchFailTime: string;
  private failCount: number = 1;

  @Cron('0 0 1,13 * * *', {
    name: '매 1시, 13시마다 mongodb 저장',
    timeZone: 'Asia/Seoul',
  })
  async mongoSave() {
    // 검색할 아이템들을 가져옴
    const findItem: Market[] = await this.marketRepository.find();

    // 검색한 아이템에 최신 가격을 추가
    const price: {
      name: string;
      price: number | null;
    }[] = await Promise.all(
      findItem.map(async (market) => await this.itemsearch.priceSearch(market)),
    );

    // 실패한 아이템 이름 추가
    price
      .filter((item) => item.price === null)
      .map((item) => this.searchFail.add(item.name));

    // mongoDB에 저장할거
    const addMongo: {
      name: string;
      price: number | null;
    }[] = price.filter((item) => item.price !== null);

    await Promise.all(
      addMongo.map(async (item) => {
        const createdItem = new this.itemModel({
          name: item.name,
          price: item.price,
        });
        await createdItem.save();
      }),
    );
    if (this.searchFail.size > 0) {
      // 실패한 시간을 서울 시간에 맞게
      this.searchFailTime = DateTime.now()
        .setZone('Asia/Seoul')
        .toFormat('yyyy년 MM월 dd일 HH시');
      setTimeout(() => this.failRetry(), 10000);
    }
  }

  private async failRetry() {
    // 실패한 아이템만 다시 검색
    const findItem: Market[] = await this.marketRepository.find({
      where: { name: In(Array.from(this.searchFail)) },
    });

    // 검색한 아이템에 최신 가격을 추가
    const price: {
      name: string;
      price: number | null;
    }[] = await Promise.all(
      findItem.map(async (market) => await this.itemsearch.priceSearch(market)),
    );

    const addMongo: {
      name: string;
      price: number | null;
    }[] = price.filter((item) => item.price !== null);

    await Promise.all(
      addMongo.map(async (item) => {
        const createdItem = new this.itemModel({
          name: item.name,
          price: item.price,
          comment: `${this.searchFailTime}에 시도하였으나 실패하였고, 현재시간 기준으로 성공하였습니다.`,
        });
        await createdItem.save();
        this.searchFail.delete(item.name);
      }),
    );

    if (this.searchFail.size > 0) {
      if (this.failCount < 66) {
        this.failCount = this.failCount + 1;
        setTimeout(() => this.failRetry(), 10000);
      } else {
        Array.from(this.searchFail).map(async (item) => {
          const lastPrice = await this.itemModel
            .findOne({ name: item })
            .sort({ createdAt: -1 })
            .select('price');

          // 직전 가격이 없을경우 처리
          // 생성시 하나 바로 만들게 되어있어서 필요없긴 할텐데 혹시몰라 놔둠
          if (!lastPrice) {
            const failedItem = new this.itemModel({
              name: item,
              price: 0,
              comment: `${this.searchFailTime}에 시도하였으나 실패한 후, 11시간 동안 재시도를 했으나 결국 실패하였고, 이전 가격 데이터도 없어 0원으로 처리하였습니다.`,
            });
            await failedItem.save();
            return;
          }

          const failedItem = new this.itemModel({
            name: item,
            price: lastPrice.price,
            comment: `${this.searchFailTime}에 시도하였으나 실패한 후, 11시간 동안 재시도를 했으나 결국 실패하여 직전 가격을 가져왔습니다.`,
          });
          await failedItem.save();
        });
      }
    }
  }
}
