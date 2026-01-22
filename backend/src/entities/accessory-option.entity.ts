// 액세서리 옵션이랑 액세서리 장비 연결해주는 테이블
// N:M -> 1:M, 1:M 2개로 변경
// 매핑테이블

import {
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MarketAccessory } from './market-accessory.entity';
import { OptionValue } from './option-value';

@Entity({ name: 'accessoryOption' })
export class AccessoryOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => MarketAccessory,
    (marketAccessory) => marketAccessory.accessoryOption,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  marketAccessory: MarketAccessory;

  @ManyToOne(
    () => OptionValue,
    (optionValue) => optionValue.accessoryOption,
    {},
  )
  @JoinColumn()
  optionValue: OptionValue;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
