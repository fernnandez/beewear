// src/domain/inventory/stock-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StockMovement } from './stock-movement.entity';
import { Product } from '../product/product.entity';

@Entity('stock_items')
export class StockItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product, (product) => product.stock, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @OneToMany(() => StockMovement, (movement) => movement.stockItem)
  movements: StockMovement[];
}
