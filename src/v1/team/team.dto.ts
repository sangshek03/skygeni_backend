import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDecimal, IsString, Length } from 'class-validator';

export class CreateTeamDto {
  @IsInt()
  count: number;

  @IsDecimal()
  acv: number;

  @IsString()
  @Length(6, 7)
  closed_fiscal_quarter: string;

  @IsString()
  name: string;
}

export class TeamResponseDto {
  @ApiProperty()
  team_id: number;

  @ApiProperty()
  count: number;

  @ApiProperty({ type: Number, format: 'decimal' })
  acv: number;

  @ApiProperty()
  closed_fiscal_quarter: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  avg_deal_size?: number;
}

export class TeamChartResponse {
  @ApiProperty({ type: () => TeamResponseDto, isArray: true })
  data: TeamResponseDto[];

  @ApiProperty()
  metadata: {
    quarters: string[];
    teams: string[];
    total_acv: number;
  };
}

export class HorizontalBarResponse {
  @ApiProperty()
  type: 'count' | 'acv';

  @ApiProperty({ type: () => [TeamPerformance] })
  teams: TeamPerformance[];
}

export class TeamPerformance {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  quarter: string;
}

export class RadarChartResponse {
  @ApiProperty()
  quarter: string;

  @ApiProperty({ type: () => [RadarMetric] })
  metrics: RadarMetric[];
}

export class RadarMetric {
  @ApiProperty()
  name: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  acv: number;
}