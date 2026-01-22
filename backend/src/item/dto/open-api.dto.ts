// api 요청했을때 응답되는 내용 타입들을 정의합니다.

export class OptionDto {
  Type: string;
  OptionName: string;
  OptionNameTripod: string;
  Value: number;
  IsPenalty: boolean;
  ClassName: string;
  IsValuePercentage: boolean;
}

export class AuctionInfoDto {
  StartPrice: number;
  BuyPrice: number;
  BidPrice: number;
  EndDate: string;
  BidCount: number;
  BidStartPrice: number;
  IsCompetitive: boolean;
  TradeAllowCount: number;
  UpgradeLevel: number | null;
}

export class AuctionsItemDto {
  Name: string;
  Grade: string;
  Tier: number;
  Level: number;
  Icon: string;
  GradeQuality: number | null;
  AuctionInfo: AuctionInfoDto;
  Options: OptionDto[];
}

export class MarketsDto {
  Id: number;
  Name: string;
  Grade: string;
  Icon: string;
  BundleCount: number;
  TradeRemainCount: number | null;
  YDayAvgPrice: number;
  RecentPrice: number;
  CurrentMinPrice: number;
}

export class EtcValueDto {
  DisplayValue: string;
  Value: number;
  IsPercentage: boolean;
}

export class EtcSubDto {
  Value: number;
  Text: string;
  Class: string;
  Categorys: number[] | null;
  Tiers: number[] | null;
  EtcValues: EtcValueDto[];
}

export class accessoryOptionsDto {
  Value: number;
  Text: string;
  Tiers: number[];
  EtcSubs: EtcSubDto[];
}
