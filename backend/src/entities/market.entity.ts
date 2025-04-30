import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'category' })
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40, unique: true })
  name: string;

  @Column()
  auctions: boolean;

  @Column()
  category: number;

  @Column({ unique: true, nullable: true })
  itemCode: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
