import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Market } from 'src/entities/market.entity';
import { ItemCheckDto } from 'src/item/dto/create-item.dto';
import { AuctionsItemDto, MarketsDto } from 'src/item/dto/open-api.dto';

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
}
