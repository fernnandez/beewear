// src/domain/inventory/stock-item.entity.ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariation } from '../productVariation/product-variation.entity';
import { StockMovement } from './stock-movement.entity';

@Entity('stock_item')
export class StockItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column({ name: 'public_id' })
  publicId: string;

  @Column()
  quantity: number;

  @OneToOne(
    () => ProductVariation,
    (productVariation) => productVariation.stock,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  productVariation: ProductVariation;

  @OneToMany(() => StockMovement, (movement) => movement.stockItem)
  movements: StockMovement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
