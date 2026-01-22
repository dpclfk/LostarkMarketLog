// 여기에서만 로아 api관련 사용할것
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Market } from 'src/entities/market.entity';
import { AccessoryDto, ItemCheckDto } from 'src/item/dto/create-item.dto';
import {
  accessoryOptionsDto,
  AuctionsItemDto,
  EtcSubDto,
  MarketsDto,
} from 'src/item/dto/open-api.dto';
import { CategoryItem } from 'src/item/dto/res-item.dto';

@Injectable()
export class ItemSearchService {
  private lostlink: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.lostlink = axios.create({
      baseURL: 'https://developer-lostark.game.onstove.com/',
      headers: {
        accept: 'application/json',
        authorization: `${this.configService.get<string>(`LOSTAPI`)}`,
      },
    });
  }

  async itemCheck(itemCheckDto: ItemCheckDto) {
    if (itemCheckDto.auctions) {
      const searchAPI = await this.lostlink.post('auctions/items', {
        ItemLevelMin: 0,
        ItemLevelMax: 0,
        ItemGradeQuality: 0,
        ItemUpgradeLevel: null,
        ItemTradeAllowCount: null,
        SkillOptions: [
          {
            FirstOption: null,
            SecondOption: null,
            MinValue: null,
            MaxValue: null,
          },
        ],
        EtcOptions: [
          {
            FirstOption: null,
            SecondOption: null,
            MinValue: null,
            MaxValue: null,
          },
        ],
        Sort: 'BUY_PRICE',
        CategoryCode: `${itemCheckDto.category}`,
        CharacterClass: '',
        ItemTier: null,
        ItemGrade: '',
        ItemName: `${itemCheckDto.name}`,
        PageNo: 1,
        SortCondition: 'ASC',
      });
      // 값이 잘못되면 null을 받는데 이경우 타입에러가 나기때문에 메시지를 명확히 하기위함
      if (searchAPI.data.Items === null) {
        throw new BadRequestException('존재하지 않는 아이템입니다.');
      }
      const itemArr: { name: string; icon: string; grade: string }[] =
        searchAPI.data.Items.map((item: AuctionsItemDto) => ({
          name: item.Name,
          icon: item.Icon,
          grade: item.Grade,
        }));
      return itemArr;
    } else {
      const searchAPI = await this.lostlink.post('markets/items', {
        Sort: 'GRADE',
        CategoryCode: `${itemCheckDto.category}`,
        CharacterClass: '',
        ItemTier: null,
        ItemGrade: '',
        ItemName: `${itemCheckDto.name}`,
        PageNo: 1,
        SortCondition: 'ASC',
      });
      const itemArr: {
        name: string;
        icon: string;
        itemCode: number;
        grade: string;
      }[] = searchAPI.data.Items.map((item: MarketsDto) => ({
        name: item.Name,
        icon: item.Icon,
        itemCode: item.Id,
        grade: item.Grade,
      }));
      return itemArr;
    }
  }
  async priceSearch(market: Market) {
    if (market.auctions) {
      const searchAPI = await this.lostlink.post('auctions/items', {
        ItemLevelMin: 0,
        ItemLevelMax: 0,
        ItemGradeQuality: 0,
        ItemUpgradeLevel: null,
        ItemTradeAllowCount: null,
        SkillOptions: [
          {
            FirstOption: null,
            SecondOption: null,
            MinValue: null,
            MaxValue: null,
          },
        ],
        EtcOptions: [
          {
            FirstOption: null,
            SecondOption: null,
            MinValue: null,
            MaxValue: null,
          },
        ],
        Sort: 'BUY_PRICE',
        CategoryCode: `${market.category}`,
        CharacterClass: '',
        ItemTier: null,
        ItemGrade: '',
        ItemName: `${market.name}`,
        PageNo: 1,
        SortCondition: 'ASC',
      });
      if (searchAPI.data.Items === null) {
        return { name: market.name, price: null };
      } else if (
        searchAPI.data.Items[1] === undefined ||
        searchAPI.data.Items[0].AuctionInfo.BuyPrice >
          searchAPI.data.Items[1].AuctionInfo.BuyPrice * 0.9
      ) {
        // 첫번째값 내보내기
        return {
          name: market.name,
          price: searchAPI.data.Items[0].AuctionInfo.BuyPrice,
        };
      } else {
        // 두번째값 내보내기
        return {
          name: market.name,
          price: searchAPI.data.Items[1].AuctionInfo.BuyPrice,
        };
      }
    } else {
      const searchAPI = await this.lostlink.get(
        `markets/items/${market.itemCode}`,
      );
      if (searchAPI.data === null) {
        return { name: market.name, price: null };
      } else {
        //  그 당일날의 평균값을 가져옴
        let price = searchAPI.data[0].Stats[0].AvgPrice;
        if (price === 0) {
          price = searchAPI.data[1].Stats[0].AvgPrice;
        }

        return {
          name: market.name,
          price: price,
        };
      }
    }
  }
  async category() {
    const markets = await this.lostlink.get('markets/options');
    const auctions = await this.lostlink.get('auctions/options');

    return {
      market_category: markets.data.Categories,
      auction_category: auctions.data.Categories,
    };
  }

  async marketAccessory(accessory: AccessoryDto) {
    const marketAccessory = await this.lostlink.post('auctions/items', {
      ItemGradeQuality: accessory.quality,
      EtcOptions: [
        {
          FirstOption: 7,
          SecondOption: accessory.accessoryUpgrade1.SecondOption,
          MinValue: accessory.accessoryUpgrade1.value,
          MaxValue: accessory.accessoryUpgrade1.value,
        },
        {
          FirstOption: 7,
          SecondOption: accessory.accessoryUpgrade2.SecondOption || null,
          MinValue: accessory.accessoryUpgrade2.value || null,
          MaxValue: accessory.accessoryUpgrade2.value || null,
        },
        {
          FirstOption: 7,
          SecondOption: accessory.accessoryUpgrade3.SecondOption || null,
          MinValue: accessory.accessoryUpgrade3.value || null,
          MaxValue: accessory.accessoryUpgrade3.value || null,
        },
      ],
      Sort: 'BUY_PRICE',
      CategoryCode: accessory.category,
      ItemTier: accessory.itemTier,
      ItemGrade: accessory.grade,
      PageNo: 1,
      SortCondition: 'asc',
    });

    console.log(marketAccessory);
  }

  async accessoryCategory() {
    const auctionsOptions = await this.lostlink.get('auctions/options');

    return {
      categories: await auctionsOptions.data.Categories.find(
        (item: CategoryItem) => item.Code === 200000,
      ).Subs,
      qualities: await auctionsOptions.data.ItemGradeQualities,
      grades: await auctionsOptions.data.ItemGrades,
    };
  }

  async accessoryOptions(id: number) {
    const auctionsOptions = await this.lostlink.get('auctions/options');
    const accessoryOptions: EtcSubDto[] =
      await auctionsOptions.data.EtcOptions.find(
        (item: accessoryOptionsDto) => item.Value === 7,
      ).EtcSubs;

    const categories = await auctionsOptions.data.Categories.find(
      (item: CategoryItem) => item.Code === 200000,
    ).Subs;

    // 유효한 카테고리 코드인지 확인
    const hasCode = (value: number): boolean => {
      return categories.some((item: CategoryItem) => item.Code === value);
    };

    if (hasCode(id)) {
      return {
        accessoryOptions: accessoryOptions.filter(
          (item) => item.Categorys === null || item.Categorys.includes(id),
        ),
      };
    } else {
      throw new BadRequestException('아이템 코드를 확인해 주세요.');
    }
  }
}
