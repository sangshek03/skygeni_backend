import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcvRange } from './acv_range.entity';
import { AcvRangeChartResponse } from './acv_range.dto';


@Injectable()
export class AcvRangeService {
  constructor(
    @InjectRepository(AcvRange)
    private readonly repository: Repository<AcvRange>,
  ) {}

  async getChartData(): Promise<AcvRangeChartResponse> {
    const data = await this.repository.find({
      order: { closed_fiscal_quarter: 'ASC' },
    });

    const enrichedData = data.map(item => ({
      ...item,
      avg_deal_size: this.calculateAvgDealSize(item.acv, item.count),
    }));

    const quarters = [...new Set(data.map(d => d.closed_fiscal_quarter))];
    const ranges = [...new Set(data.map(d => d.range))];

    return {
      data: enrichedData,
      metadata: {
        quarters,
        ranges,
        totalRecords: data.length,
      },
    };
  }

  async getWaterfallData() {
    const ranges = await this.repository
      .createQueryBuilder()
      .select(['range', 'SUM(acv) as total_acv', 'SUM(count) as total_count'])
      .groupBy('range')
      .orderBy('total_acv', 'ASC')
      .getRawMany();

    return {
      type: 'waterfall',
      data: ranges,
      metadata: {
        total_acv: ranges.reduce((sum, r) => sum + parseFloat(r.total_acv), 0),
        total_count: ranges.reduce((sum, r) => sum + parseInt(r.total_count), 0),
      },
    };
  }

  async getHeatmapData() {
    const data = await this.repository
      .createQueryBuilder()
      .select([
        'closed_fiscal_quarter as quarter',
        'range',
        'SUM(count) as deal_count',
        'SUM(acv) as total_acv',
      ])
      .groupBy('closed_fiscal_quarter, range')
      .getRawMany();

    return {
      type: 'heatmap',
      data,
      metadata: {
        quarters: [...new Set(data.map(d => d.quarter))],
        ranges: [...new Set(data.map(d => d.range))],
      },
    };
  }

  private calculateAvgDealSize(acv: number, count: number): number {
    return count > 0 ? parseFloat((acv / count).toFixed(2)) : 0;
  }
}