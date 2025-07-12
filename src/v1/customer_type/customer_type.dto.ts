import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDecimal, IsString, Length } from 'class-validator';

export class CreateCustomerTypeDto {
  @IsInt()
  count: number;

  @IsDecimal()
  acv: number;

  @IsString()
  @Length(6, 7)
  closed_fiscal_quarter: string;

  @IsString()
  type: string;
}


export class CustomerTypeResponseDto {
  @ApiProperty()
  customer_type_id: number;

  @ApiProperty()
  count: number;

  @ApiProperty({ type: Number, format: 'decimal' })
  acv: number;

  @ApiProperty()
  closed_fiscal_quarter: string;

  @ApiProperty({ enum: ['New Customer', 'Existing Customer'] })
  type: string;

  @ApiProperty({ required: false })
  acv_per_deal?: number;
}

export class CustomerTypeChartResponse {
  @ApiProperty({ type: () => CustomerTypeResponseDto, isArray: true })
  data: CustomerTypeResponseDto[];

  @ApiProperty()
  metadata: {
    quarters: string[];
    total_acv: number;
    new_customer_ratio: number;
  };
}

export class DonutChartResponse {
  @ApiProperty()
  quarter: string;

  @ApiProperty({ type: () => [DonutSegment] })
  segments: DonutSegment[];
}

export class DonutSegment {
  @ApiProperty()
  type: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  acv: number;

  @ApiProperty()
  percentage: number;
}

export class SparklineResponse {
  @ApiProperty()
  type: string;

  @ApiProperty({ type: () => [SparklinePoint] })
  trend: SparklinePoint[];
}

export class SparklinePoint {
  @ApiProperty()
  quarter: string;

  @ApiProperty()
  value: number;
}