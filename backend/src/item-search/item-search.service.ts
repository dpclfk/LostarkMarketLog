import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CreateItemDto, ItemCheckDto } from 'src/item/dto/create-item.dto';
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
    if (itemCheckDto.autcions) {
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
      // 값이 잘못되면 null을 받는데 이경우 map관련 문제가 생겨 if로 따로 뺌
      if (searchAPI.data.Items === null) {
        throw new BadRequestException('존재하지 않는 아이템입니다.');
      }
      const itemArr: { name: string; icon: string }[] =
        searchAPI.data.Items.map((item: AuctionsItemDto) => ({
          name: item.Name,
          icon: item.Icon,
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
      const itemArr: { name: string; icon: string; itemCode: number }[] =
        searchAPI.data.Items.map((item: MarketsDto) => ({
          name: item.Name,
          icon: item.Icon,
          itemCode: item.Id,
        }));
      return itemArr;
    }
  }
  async itemSearch(createItemDto: CreateItemDto) {}
}
