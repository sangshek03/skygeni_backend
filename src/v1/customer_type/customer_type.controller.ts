import { Controller, Get, Query } from '@nestjs/common';

import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery 
} from '@nestjs/swagger';
import { CustomerTypeService } from './customer_type.service';
import { CustomerTypeChartResponse, DonutChartResponse, SparklineResponse } from './customer_type.dto';


@ApiTags('Sales Analytics - Customer Type')
@Controller('analytics/customer-type')
export class CustomerTypeController {
  constructor(private readonly service: CustomerTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customer type data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Customer type data with metadata',
    type: CustomerTypeChartResponse
  })
  async getAll(): Promise<CustomerTypeChartResponse> {
    return this.service.getChartData();
  }

  @Get('donut')
  @ApiOperation({ summary: 'Get donut chart data' })
  @ApiQuery({
    name: 'quarter',
    required: false,
    description: 'Specific quarter to view (YYYY-QX format)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Data formatted for donut chart visualization',
    type: DonutChartResponse
  })
  async getDonutChart(@Query('quarter') quarter?: string): Promise<DonutChartResponse> {
    return this.service.getDonutChartData(quarter);
  }

  @Get('sparkline')
  @ApiOperation({ summary: 'Get sparkline trend data' })
  @ApiResponse({ 
    status: 200, 
    description: 'New vs existing customer trends over time',
    type: SparklineResponse,
    isArray: true
  })
  async getSparklineData(): Promise<SparklineResponse[]> {
    return this.service.getSparklineData();
  }
}