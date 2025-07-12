import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  team_id: number;

  @Column('int')
  count: number;

  @Column('decimal', { precision: 15, scale: 2 })
  acv: number;

  @Column({ length: 7 }) // Format: 'YYYY-QX'
  closed_fiscal_quarter: string;

  @Column({ length: 50 }) // e.g., 'North America', 'Europe'
  name: string;

  @CreateDateColumn()
  created_at: Date;

  // Calculated virtual field (not stored in DB)
  avg_deal_size?: number;
}