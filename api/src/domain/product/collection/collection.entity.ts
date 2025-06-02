import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('collection')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;
}
