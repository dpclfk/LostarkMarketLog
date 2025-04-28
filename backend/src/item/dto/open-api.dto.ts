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
