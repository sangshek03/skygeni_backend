import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CustomerTypeChartResponse,
  DonutChartResponse,
  SparklineResponse,
} from './customer_type.dto';
import { CustomerType } from './customer_type.entity';

@Injectable()
export class CustomerTypeService {
  constructor(
    @InjectRepository(CustomerType)
    private readonly repository: Repository<CustomerType>,
  ) {}

  async getChartData(): Promise<CustomerTypeChartResponse> {
    const data = await this.repository.find({
      order: { closed_fiscal_quarter: 'ASC' },
    });

    const enrichedData = data.map((item) => ({
      ...item,
      acv_per_deal: this.calculateAcvPerDeal(item.acv, item.count),
    }));

    const quarters = [...new Set(data.map((d) => d.closed_fiscal_quarter))];
    const total_acv = data.reduce((sum, item) => sum + item.acv, 0);
    const newCustomers = data.filter((d) => d.type === 'New Customer');
    const newCustomerRatio =
      newCustomers.length > 0
        ? (newCustomers.reduce((sum, item) => sum + item.count, 0) /
            data.reduce((sum, item) => sum + item.count, 0)) *
          100
        : 0;

    return {
      data: enrichedData,
      metadata: {
        quarters,
        total_acv,
        new_customer_ratio: parseFloat(newCustomerRatio.toFixed(2)),
      },
    };
  }

  async getDonutChartData(quarter?: string): Promise<DonutChartResponse> {
    const query = this.repository.createQueryBuilder();

    if (quarter) {
      query.where('closed_fiscal_quarter = :quarter', { quarter });
    } else {
      // Get latest quarter if none specified
      const latest = await this.repository
        .createQueryBuilder()
        .select('closed_fiscal_quarter')
        .orderBy('closed_fiscal_quarter', 'DESC')
        .limit(1)
        .getRawOne();
      quarter = latest?.closed_fiscal_quarter;
      if (quarter) {
        query.where('closed_fiscal_quarter = :quarter', { quarter });
      }
    }

    const data = await query.getMany();
    const total = data.reduce((sum, item) => sum + item.acv, 0);

    const segments = data.map((item) => ({
      type: item.type,
      count: item.count,
      acv: item.acv,
      percentage: parseFloat(((item.acv / total) * 100).toFixed(2)),
    }));

    return {
      quarter: quarter || '',
      segments,
    };
  }

  async getSparklineData(): Promise<SparklineResponse[]> {
    const newCustomers = await this.repository
      .createQueryBuilder()
      .select([
        'closed_fiscal_quarter as quarter',
        'SUM(count) as count',
        'SUM(acv) as acv',
      ])
      .where('type = :type', { type: 'New Customer' })
      .groupBy('closed_fiscal_quarter')
      .orderBy('closed_fiscal_quarter')
      .getRawMany();

    const existingCustomers = await this.repository
      .createQueryBuilder()
      .select([
        'closed_fiscal_quarter as quarter',
        'SUM(count) as count',
        'SUM(acv) as acv',
      ])
      .where('type = :type', { type: 'Existing Customer' })
      .groupBy('closed_fiscal_quarter')
      .orderBy('closed_fiscal_quarter')
      .getRawMany();

    return [
      {
        type: 'New Customer',
        trend: newCustomers.map((item) => ({
          quarter: item.quarter,
          value: item.count,
        })),
      },
      {
        type: 'Existing Customer',
        trend: existingCustomers.map((item) => ({
          quarter: item.quarter,
          value: item.count,
        })),
      },
    ];
  }

  private calculateAcvPerDeal(acv: number, count: number): number {
    return count > 0 ? parseFloat((acv / count).toFixed(2)) : 0;
  }
}
