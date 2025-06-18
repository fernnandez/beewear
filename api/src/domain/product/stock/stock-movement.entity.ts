// src/domain/inventory/stock-movement.entity.ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StockItem } from './stock-item.entity';

@Entity('stock_movement')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column({ name: 'public_id' })
  publicId: string;

  @ManyToOne(() => StockItem, (stockItem) => stockItem.movements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  stockItem: StockItem;

  @Column({ enum: ['IN', 'OUT'] })
  type: 'IN' | 'OUT';

  @Column()
  quantity: number;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
