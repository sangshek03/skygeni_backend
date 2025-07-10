import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDecimal, IsString, Length } from 'class-validator';

/**
 * Data Transfer Object for creating new Account Industry records
 * Validates incoming data before saving to database
 */
export class CreateAccountIndustryDto {
  @IsInt({ message: 'Count must be an integer' })
  count: number;

  @IsDecimal({}, { message: 'ACV must be a decimal value' })
  acv: number;

  @IsString()
  @Length(6, 7, { 
    message: 'Quarter must be in YYYY-QX format (e.g. 2023-Q1)' 
  })
  closed_fiscal_quarter: string;

  @IsString()
  acct_industry: string;

  @IsString()
  query_key?: string = 'industry'; // Default value if not provided
}

export class AccountIndustryResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the record',
    example: 1
  })
  account_industry_id: number;

  @ApiProperty({
    description: 'Number of deals/customers in this category',
    example: 5
  })
  count: number;

  @ApiProperty({
    description: 'Annual Contract Value (total yearly revenue)',
    type: Number,
    format: 'decimal',
    example: 150000.50
  })
  acv: number;

  @ApiProperty({
    description: 'Fiscal quarter when deals were closed (YYYY-QX format)',
    example: '2023-Q4'
  })
  closed_fiscal_quarter: string;

  @ApiProperty({
    description: 'Name of the industry sector',
    example: 'Technology Services'
  })
  acct_industry: string;

  @ApiProperty({
    description: 'Calculated average ACV per deal',
    required: false,
    example: 30000.10
  })
  acv_per_deal?: number;
}

/**
 * Specialized response format for chart visualizations
 * Includes metadata for frontend display configuration
 */
export class AccountIndustryChartResponse {
  @ApiProperty({ 
    type: () => AccountIndustryResponseDto, 
    isArray: true,
    description: 'Array of industry data records' 
  })
  data: AccountIndustryResponseDto[];

  @ApiProperty({
    description: 'Contextual information about the dataset',
    example: {
      available_quarters: ['2023-Q3', '2023-Q4'],
      industry_types: ['Technology', 'Healthcare'],
      record_count: 25
    }
  })
  metadata: {
    available_quarters: string[];
    industry_types: string[];
    record_count: number;
  };
}
