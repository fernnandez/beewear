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
import { Collection } from './collection/collection.entity';
import { ProductVariation } from './productVariation/product-variation.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column({ name: 'public_id' })
  publicId: string;

  @Column()
  name: string;

  @Column({ default: false })
  active: boolean;

  @OneToMany(() => ProductVariation, (variation) => variation.product, {
    onDelete: 'CASCADE',
  })
  variations: ProductVariation[];

  @ManyToOne(() => Collection, (collection) => collection.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  collection?: Collection;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
