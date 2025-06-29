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
import { ProductVariationSize } from '../productVariation/product-variation-size.entity';
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
    () => ProductVariationSize,
    (productVariationSize) => productVariationSize.stock,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  productVariationSize: ProductVariationSize;

  @OneToMany(() => StockMovement, (movement) => movement.stockItem)
  movements: StockMovement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
