import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../product.entity';
import { ProductVariationSize } from './product-variation-size.entity';

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
  name: string;

  @Column({
    type: 'numeric',
    scale: 2,
    precision: 10,
  })
  price: number;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @ManyToOne(() => Product, (product) => product.variations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @OneToMany(
    () => ProductVariationSize,
    (productVariationSize) => productVariationSize.productVariation,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  sizes: ProductVariationSize[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
