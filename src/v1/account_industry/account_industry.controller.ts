import { Controller, Get, Query } from '@nestjs/common';

import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery 
} from '@nestjs/swagger';
import { AccountIndustryChartResponse } from './account_industry.dto';
import { AccountIndustryService } from './account_industry.service';


@ApiTags('Sales Analytics - Account Industry')
@Controller('analytics/account-industry')
export class AccountIndustryController {
  constructor(private readonly service: AccountIndustryService) {}

  /**
   * Fetch all account industry records with basic formatting
   * Suitable for tabular displays or raw data consumption
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all account industry records',
    description: 'Returns complete dataset with calculated metrics'
  })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of account industry data',
    type: AccountIndustryChartResponse
  })
  async getAll(): Promise<AccountIndustryChartResponse> {
    return this.service.getChartData();
  }

  /**
   * Get data optimized for stacked bar chart visualization
   * Groups by quarter and includes pre-aggregated values
   */
  @Get('stacked-bar')
  @ApiOperation({
    summary: 'Get data formatted for stacked bar chart',
    description: 'Quarterly breakdown with industry segments'
  })
  @ApiResponse({
    status: 200,
    description: 'Data formatted for chart visualization'
  })
  async getStackedBar() {
    return this.service.getStackedBarData();
  }

  /**
   * Get data for pie chart visualization of a specific quarter
   * Includes percentage breakdowns and total values
   */
  @Get('pie-chart')
  @ApiOperation({
    summary: 'Get industry distribution for a specific quarter',
    description: 'Percentage breakdown suitable for pie/donut charts'
  })
  @ApiQuery({
    name: 'quarter',
    required: true,
    description: 'Fiscal quarter in YYYY-QX format',
    example: '2023-Q4'
  })
  @ApiResponse({
    status: 200,
    description: 'Industry distribution for requested quarter'
  })
  async getPieChart(
    @Query('quarter') quarter: string
  ) {
    if (!quarter.match(/^\d{4}-Q[1-4]$/)) {
      throw new Error('Invalid quarter format. Use YYYY-QX (e.g. 2023-Q2)');
    }
    return this.service.getPieChartData(quarter);
  }
}