// 실제 받는 값
// {
//   "Value": 45,
//   "Text": "공격력 %",
//   "Class": "",
//   "Categorys": [
//     200020
//   ],
//   "Tiers": null,
//   "EtcValues": [
//     {
//       "DisplayValue": "0.19%",
//       "Value": 19,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "0.24%",
//       "Value": 24,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "0.29%",
//       "Value": 29,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "0.40%",
//       "Value": 40,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "0.42%",
//       "Value": 42,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "0.54%",
//       "Value": 54,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "0.66%",
//       "Value": 66,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "0.70%",
//       "Value": 70,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "0.89%",
//       "Value": 89,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "0.95%",
//       "Value": 95,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "1.09%",
//       "Value": 109,
//       "IsPercentage": true
//     },
//     {
//       "DisplayValue": "1.55%",
//       "Value": 155,
//       "IsPercentage": true
//     }
//   ]
// },

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

@Entity({ name: 'optionValue' })
export class OptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  optionName: string;

  @Column()
  optionValue: number;

  @Column()
  displayValue: string;

  @Column()
  optionEtcValues: number;

  @Column()
  Categorys: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToMany(
    () => AccessoryOption,
    (accessoryOption) => accessoryOption.optionValue,
  )
  accessoryOption: AccessoryOption[];
}
