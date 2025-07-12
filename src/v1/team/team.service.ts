import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { HorizontalBarResponse, RadarChartResponse, TeamChartResponse } from './team.dto';


@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly repository: Repository<Team>,
  ) {}

  async getChartData(): Promise<TeamChartResponse> {
    const data = await this.repository.find({
      order: { closed_fiscal_quarter: 'ASC' },
    });

    const enrichedData = data.map(item => ({
      ...item,
      avg_deal_size: this.calculateAvgDealSize(item.acv, item.count),
    }));

    const quarters = [...new Set(data.map(d => d.closed_fiscal_quarter))];
    const teams = [...new Set(data.map(d => d.name))];
    const total_acv = data.reduce((sum, item) => sum + item.acv, 0);

    return {
      data: enrichedData,
      metadata: {
        quarters,
        teams,
        total_acv
      }
    };
  }

  async getHorizontalBarData(quarter?: string): Promise<HorizontalBarResponse[]> {
    let query = this.repository.createQueryBuilder();
    
    if (quarter) {
      query = query.where('closed_fiscal_quarter = :quarter', { quarter });
    }

    const data = await query.getMany();

    return [
      {
        type: 'count',
        teams: data.map(item => ({
          name: item.name,
          value: item.count,
          quarter: item.closed_fiscal_quarter
        })).sort((a, b) => b.value - a.value)
      },
      {
        type: 'acv',
        teams: data.map(item => ({
          name: item.name,
          value: item.acv,
          quarter: item.closed_fiscal_quarter
        })).sort((a, b) => b.value - a.value)
      }
    ];
  }

  async getRadarChartData(quarters: string[]): Promise<RadarChartResponse[]> {
  // Initialize results with explicit type
  const results: RadarChartResponse[] = [];
  
  if (!quarters || quarters.length === 0) {
    // Get all quarters if none specified
    const allQuarters = await this.repository
      .createQueryBuilder()
      .select('DISTINCT(closed_fiscal_quarter)', 'quarter')
      .orderBy('quarter', 'ASC')
      .getRawMany();
    quarters = allQuarters.map(q => q.quarter);
  }

  for (const quarter of quarters) {
    const data = await this.repository
      .createQueryBuilder()
      .where('closed_fiscal_quarter = :quarter', { quarter })
      .getMany();

    // Create properly typed RadarChartResponse object
    const radarData: RadarChartResponse = {
      quarter,
      metrics: data.map(item => ({
        name: item.name,
        count: item.count,
        acv: item.acv
      }))
    };

    results.push(radarData);
  }

  return results;
}

  private calculateAvgDealSize(acv: number, count: number): number {
    return count > 0 ? parseFloat((acv / count).toFixed(2)) : 0;
  }
}