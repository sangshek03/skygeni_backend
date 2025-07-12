import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('customer_type')
export class CustomerType {
  @PrimaryGeneratedColumn()
  customer_type_id: number;

  @Column('int')
  count: number;

  @Column('decimal', { precision: 15, scale: 2 })
  acv: number;

  @Column({ length: 7 }) // Format: 'YYYY-QX'
  closed_fiscal_quarter: string;

  @Column({ length: 20 }) // 'New Customer' or 'Existing Customer'
  type: string;

  @CreateDateColumn()
  created_at: Date;

  // Calculated virtual field (not stored in DB)
  acv_per_deal?: number;
}