import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDecimal, IsString, Length } from 'class-validator';

export class CreateAcvRangeDto {
  @IsInt()
  count: number;

  @IsDecimal()
  acv: number;

  @IsString()
  @Length(6, 7)
  closed_fiscal_quarter: string;

  @IsString()
  range: string;
}


export class AcvRangeResponseDto {
  @ApiProperty()
  acv_range_id: number;

  @ApiProperty()
  count: number;

  @ApiProperty({ type: Number, format: 'decimal' })
  acv: number;

  @ApiProperty()
  closed_fiscal_quarter: string;

  @ApiProperty()
  range: string;

  @ApiProperty({ required: false })
  avg_deal_size?: number;
}

export class AcvRangeChartResponse {
  @ApiProperty({ type: () => AcvRangeResponseDto, isArray: true })
  data: AcvRangeResponseDto[];

  @ApiProperty()
  metadata: {
    quarters: string[];
    ranges: string[];
    totalRecords: number;
  };
}