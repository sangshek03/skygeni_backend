import { Controller, Get, Query } from '@nestjs/common';
import { TeamService } from './team.service';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery 
} from '@nestjs/swagger';
import { HorizontalBarResponse, RadarChartResponse, TeamChartResponse } from './team.dto';


@ApiTags('Sales Analytics - Team')
@Controller('analytics/team')
export class TeamController {
  constructor(private readonly service: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'Get all team performance data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Team data with metadata',
    type: TeamChartResponse
  })
  async getAll(): Promise<TeamChartResponse> {
    return this.service.getChartData();
  }

  @Get('horizontal-bar')
  @ApiOperation({ summary: 'Get horizontal bar chart data' })
  @ApiQuery({
    name: 'quarter',
    required: false,
    description: 'Specific quarter to view (YYYY-QX format)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Data formatted for horizontal bar chart',
    type: HorizontalBarResponse,
    isArray: true
  })
  async getHorizontalBar(
    @Query('quarter') quarter?: string
  ): Promise<HorizontalBarResponse[]> {
    return this.service.getHorizontalBarData(quarter);
  }

  @Get('radar')
  @ApiOperation({ summary: 'Get radar chart data' })
  @ApiQuery({
    name: 'quarters',
    required: false,
    description: 'Comma-separated quarters to compare (YYYY-QX,YYYY-QX)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Data formatted for radar chart comparison',
    type: RadarChartResponse,
    isArray: true
  })
  async getRadarChart(
    @Query('quarters') quarters?: string
  ): Promise<RadarChartResponse[]> {
    const quarterArray = quarters ? quarters.split(',') : [];
    return this.service.getRadarChartData(quarterArray);
  }
}