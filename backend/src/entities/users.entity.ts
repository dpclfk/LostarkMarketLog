import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40, unique: true, nullable: false })
  email: string;

  @Column({ select: false, length: 60, nullable: false })
  password: string;

  @Column({ length: 20, unique: true, nullable: false })
  nickname: string;

  @Column({ default: false })
  admin: boolean;

  @Column({ length: 256, select: false, nullable: true })
  refresh: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
