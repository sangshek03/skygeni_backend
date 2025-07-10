import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity("account_industry")
export class AccountIndustry {
  @PrimaryGeneratedColumn()
  account_industry_id: number;

  @Column('int')
  count: number;

  @Column('decimal', { precision: 15, scale: 2 })
  acv: number;

  @Column({ length: 7 }) // Format: 'YYYY-QX'
  closed_fiscal_quarter: string;

  @Column({ length: 50 })
  acct_industry: string;

  @Column({ length: 20, default: 'industry' })
  query_key: string;

  @CreateDateColumn()
  created_at: Date;

  // Calculated virtual field (not stored in DB)
  acv_per_deal?: number;
}