import { StockItem } from 'src/domain/product/stock/stock-item.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariation } from './product-variation.entity';

export enum Size {
  XXS = 'XXS',
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

@Entity('product_variation_size')
export class ProductVariationSize {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column({ name: 'public_id' })
  publicId: string;

  @Column()
  size: Size;

  @ManyToOne(() => ProductVariation, (variation) => variation.sizes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  productVariation: ProductVariation;

  @OneToOne(() => StockItem, (stock) => stock.productVariationSize)
  stock: StockItem;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
