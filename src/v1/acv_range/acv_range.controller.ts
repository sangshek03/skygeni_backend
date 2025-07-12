import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AcvRangeService } from './acv_range.service';
import { AcvRangeChartResponse } from './acv_range.dto';

@ApiTags('Sales Analytics - ACV Range')
@Controller('analytics/acv-range')
export class AcvRangeController {
  constructor(private readonly service: AcvRangeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ACV range data' })
  @ApiResponse({ 
    status: 200, 
    description: 'ACV range data with metadata',
    type: AcvRangeChartResponse 
  })
  async getAll(): Promise<AcvRangeChartResponse> {
    return this.service.getChartData();
  }

  @Get('waterfall')
  @ApiOperation({ summary: 'Get waterfall chart data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Data formatted for waterfall chart visualization' 
  })
  async getWaterfall() {
    return this.service.getWaterfallData();
  }

  @Get('heatmap')
  @ApiOperation({ summary: 'Get heatmap data' })
  @ApiQuery({
    name: 'normalize',
    required: false,
    description: 'Normalize by count or ACV',
    enum: ['count', 'acv']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Data formatted for heatmap visualization' 
  })
  async getHeatmap(@Query('normalize') normalize?: string) {
    return this.service.getHeatmapData();
  }
}