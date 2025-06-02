// src/domain/inventory/stock-movement.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockItem } from './stock-item.entity';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StockItem, (stockItem) => stockItem.movements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  stockItem: StockItem;

  @Column()
  stockItemId: string;

  @Column({ type: 'enum', enum: ['IN', 'OUT'] })
  type: 'IN' | 'OUT';

  @Column()
  quantity: number;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;
}
