import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('acv_range')
export class AcvRange {
  @PrimaryGeneratedColumn()
  acv_range_id: number;

  @Column('int')
  count: number;

  @Column('decimal', { precision: 15, scale: 2 })
  acv: number;

  @Column({ length: 7 }) // Format: 'YYYY-QX'
  closed_fiscal_quarter: string;

  @Column({ length: 20 }) // e.g., '$20K-50K'
  range: string;

  @CreateDateColumn()
  created_at: Date;

  // Calculated virtual field (not stored in DB)
  avg_deal_size?: number;
}