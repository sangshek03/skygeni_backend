import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountIndustry } from './account_industry.entity';
import { AccountIndustryChartResponse } from './account_industry.dto';


@Injectable()
export class AccountIndustryService {
  constructor(
    @InjectRepository(AccountIndustry)
    private readonly repository: Repository<AccountIndustry>,
  ) {}

  /**
   * Retrieves all account industry data with calculated metrics
   * @returns Formatted response with data and metadata
   */
  async getChartData(): Promise<AccountIndustryChartResponse> {
    // Fetch all records ordered by quarter
    const records = await this.repository.find({
      order: { closed_fiscal_quarter: 'ASC' },
    });

    // Enrich data with calculated fields
    const enrichedData = records.map(record => ({
      ...record,
      acv_per_deal: this.calculateAcvPerDeal(record.acv, record.count),
    }));

    // Extract unique values for metadata
    const availableQuarters = [
      ...new Set(records.map(r => r.closed_fiscal_quarter)),
    ];
    const industryTypes = [
      ...new Set(records.map(r => r.acct_industry)),
    ];

    return {
      data: enrichedData,
      metadata: {
        available_quarters: availableQuarters,
        industry_types: industryTypes,
        record_count: records.length,
      },
    };
  }

  /**
   * Formats data specifically for stacked bar chart visualization
   * Groups by quarter and structures data for industry comparison
   */
  async getStackedBarData() {
    const quarterlyData = await this.repository
      .createQueryBuilder('ai')
      .select([
        'ai.closed_fiscal_quarter AS quarter',
        'SUM(ai.acv) AS total_acv',
        `JSON_AGG(
          JSON_BUILD_OBJECT(
            'name', ai.acct_industry,
            'acv', ai.acv,
            'count', ai.count
          )
        ) AS industries`,
      ])
      .groupBy('ai.closed_fiscal_quarter')
      .orderBy('ai.closed_fiscal_quarter')
      .getRawMany();

    return {
      visualization_type: 'stacked_bar',
      data: quarterlyData.map(q => ({
        ...q,
        // Parse JSON if using PostgreSQL < 14
        industries: typeof q.industries === 'string' 
          ? JSON.parse(q.industries) 
          : q.industries,
      })),
      metadata: {
        available_quarters: quarterlyData.map(q => q.quarter),
        industries: [
          ...new Set(
            quarterlyData.flatMap(q => 
              (typeof q.industries === 'string' 
                ? JSON.parse(q.industries) 
                : q.industries
              ).map(i => i.name)
            )
          ),
        ],
      },
    };
  }

  /**
   * Prepares data for pie chart visualization of a specific quarter
   * @param quarter Fiscal quarter in YYYY-QX format
   */
  async getPieChartData(quarter: string) {
    // Validate quarter format
    if (!quarter.match(/^\d{4}-Q[1-4]$/)) {
      throw new Error('Invalid quarter format. Use YYYY-QX (e.g. 2023-Q2)');
    }

    // Get total ACV for the quarter
    const quarterTotal = await this.repository
      .createQueryBuilder()
      .select('SUM(acv)', 'total_acv')
      .where('closed_fiscal_quarter = :quarter', { quarter })
      .getRawOne();

    // Get all industries for the quarter
    const industries = await this.repository
      .createQueryBuilder()
      .select([
        'acct_industry AS industry',
        'acv',
        'count',
        // Calculate percentage directly in SQL
        `ROUND((acv / ${quarterTotal.total_acv || 1} * 100, 2) AS percentage`,
      ])
      .where('closed_fiscal_quarter = :quarter', { quarter })
      .orderBy('acv', 'DESC')
      .getRawMany();

    // Group small segments into "Other" if more than 5 industries
    const processedData = industries.length > 5
      ? this.groupSmallSegments(industries)
      : industries;

    return {
      visualization_type: 'pie',
      quarter,
      data: processedData,
      total_acv: quarterTotal.total_acv,
      metadata: {
        primary_industry: industries[0]?.industry || null,
        industry_count: industries.length,
      },
    };
  }

  // --- Helper Methods --- //

  /**
   * Calculates average ACV per deal
   * @param acv Total Annual Contract Value
   * @param count Number of deals
   * @returns Calculated average, returns 0 if count is 0
   */
  private calculateAcvPerDeal(acv: number, count: number): number {
    return count > 0 ? parseFloat((acv / count).toFixed(2)) : 0;
  }

  /**
   * Groups smaller segments (under 5% contribution) into "Other" category
   * @param industries Raw industry data
   * @returns Processed array with combined small segments
   */
  private groupSmallSegments(industries: any[]) {
    const threshold = 5; // 5% threshold
    const mainSegments = industries.filter(i => i.percentage >= threshold);
    const otherSegments = industries.filter(i => i.percentage < threshold);

    if (otherSegments.length > 0) {
      const combinedOther = {
        industry: 'Other',
        acv: otherSegments.reduce((sum, i) => sum + parseFloat(i.acv), 0),
        count: otherSegments.reduce((sum, i) => sum + parseInt(i.count), 0),
        percentage: otherSegments.reduce((sum, i) => sum + parseFloat(i.percentage), 0),
      };

      return [...mainSegments, combinedOther];
    }

    return mainSegments;
  }
}