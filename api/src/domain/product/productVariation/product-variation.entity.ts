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
import { Product } from '../product.entity';
import { StockItem } from 'src/domain/product/stock/stock-item.entity';

@Entity('product_variation')
export class ProductVariation {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column({ name: 'public_id' })
  publicId: string;

  @Column()
  color: string;

  @Column()
  size: string;

  @Column({
    type: 'numeric',
    scale: 2,
    precision: 10,
  })
  price: number;

  @ManyToOne(() => Product, (product) => product.variations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @OneToOne(() => StockItem, (stock) => stock.productVariation)
  stock: StockItem;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
