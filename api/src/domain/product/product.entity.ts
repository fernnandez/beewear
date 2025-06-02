import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StockItem } from '../stock/stock-item.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  color: string;

  @Column()
  size: string; // Pode ser enum futuramente

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  collectionId?: string; // FK opcional

  @OneToOne(() => StockItem, (stock) => stock.product)
  stock: StockItem;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
