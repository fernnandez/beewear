import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  // Dados snapshot do produto no momento da compra
  @Column({ type: 'varchar' })
  productName: string;

  @Column({ type: 'varchar' })
  variationName: string;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar' })
  size: string;

  @Column({ type: 'varchar', nullable: true })
  image: string | null;

  // Dados do pedido
  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'varchar' })
  productVariationSizePublicId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
