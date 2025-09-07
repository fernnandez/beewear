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
import { User } from '../user/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from './enums/order-status.enum';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column({ name: 'public_id' })
  publicId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  paymentIntentId: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ nullable: true, name: 'shippingAddress' })
  shippingAddress: string;

  @Column({ nullable: true })
  paymentMethodType: string; // 'CREDIT_CARD', 'KLARNA', 'PIX', 'BANK_TRANSFER', 'OTHER'

  @Column({ nullable: true })
  paymentStatus: string; // 'PENDING', 'PAID', 'FAILED', 'REFUNDED'

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
