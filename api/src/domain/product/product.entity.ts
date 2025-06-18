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

  @Column({ nullable: true })
  imageUrl?: string;

  @OneToMany(() => ProductVariation, (variation) => variation.product, {
    onDelete: 'CASCADE',
  })
  variations: ProductVariation[];

  // Relação ManyToOne opcional (categoria pode ser null)
  @ManyToOne(() => Collection, (collection) => collection.products, {
    nullable: true,
    onDelete: 'SET NULL', // quando categoria for deletada, seta o campo como null
  })
  @JoinColumn()
  collection?: Collection; // campo opcional no TypeScript também

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
