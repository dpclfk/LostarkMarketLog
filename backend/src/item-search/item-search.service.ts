import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ItemCheckDto } from 'src/item/dto/create-item.dto';
import { AuctionsItemDto, MarketsDto } from 'src/item/dto/open-api.dto';

@Injectable()
export class ItemSearchService {
  constructor(private configService: ConfigService) {}
  async itemCheck(itemCheckDto: ItemCheckDto) {
    const lostlink: AxiosInstance = axios.create({
      baseURL: 'https://developer-lostark.game.onstove.com/',
      headers: {
        accept: 'application/json',
        authorization: `${this.configService.get<string>(`LOSTAPI`)}`,
      },
    });

    if (itemCheckDto.autcions) {
      const searchAPI = await lostlink.post('auctions/items', {
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

      const itemArr: { name: string; icon: string }[] =
        searchAPI.data.Items.map((item: AuctionsItemDto) => ({
          name: item.Name,
          icon: item.Icon,
        }));
      return itemArr;
    } else {
      const searchAPI = await lostlink.post('markets/items', {
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
}
