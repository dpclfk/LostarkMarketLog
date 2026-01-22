import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { AccessoryOption } from './accessory-option.entity';

@Entity({ name: 'marketAccessory' })
export class MarketAccessory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: number;

  @Column()
  itemTier: number;

  @Column({ length: 10, nullable: false })
  grade: string;

  @Column()
  itemGradeQuality: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToMany(
    () => AccessoryOption,
    (accessoryOption) => accessoryOption.marketAccessory,
  )
  accessoryOption: AccessoryOption[];
}
