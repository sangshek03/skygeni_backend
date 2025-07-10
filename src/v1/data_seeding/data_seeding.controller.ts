import { Controller, Post, Get, Query } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DataSeederService } from './data_seeding.service';

@ApiTags('Data Seeding')
@Controller('seed')
export class DataSeederController {
  constructor(private readonly seederService: DataSeederService) {}

  @Post()
  @ApiOperation({ summary: 'Seed data from JSON files' })
  @ApiQuery({
    name: 'type',
    required: true,
    description: 'Type of data to seed',
    enum: ['account-industry', 'acv-range', 'customer-type', 'team']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Data seeded successfully',
    schema: {
      example: {
        message: 'account-industry data seeded successfully',
        count: 25
      }
    }
  })
  async seedData(@Query('type') dataType: string) {
    const fileMap = {
      'account-industry': 'mock_data/account_industry.json',
      'acv-range': '../../mock_data/acv_range.json',
      'customer-type': '../../mock_data/customer_type.json',
      'team': '../../mock_data/team.json'
    };

    if (!fileMap[dataType]) {
      throw new Error(`Invalid data type: ${dataType}`);
    }

    return this.seederService.seedFromJson(dataType, fileMap[dataType]);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get record count for a data type' })
  @ApiQuery({
    name: 'type',
    required: true,
    description: 'Type of data to count',
    enum: ['account-industry', 'acv-range', 'customer-type', 'team']
  })
  async getCount(@Query('type') dataType: string) {
    const count = await this.seederService.getRecordCount(dataType);
    return { 
      dataType,
      count 
    };
  }
}