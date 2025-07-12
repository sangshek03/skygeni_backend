import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountIndustry } from '../account_industry/account_industry.entity';
import { DataSeederService } from './data_seeding.service';
import { DataSeederController } from './data_seeding.controller';
import { AcvRange } from '../acv_range/acv_range.entity';
import { CustomerType } from '../customer_type/customer_type.entity';
import { Team } from '../team/team.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([AccountIndustry, AcvRange, CustomerType, Team])
  ],
  providers: [
    DataSeederService
  ],
  controllers: [
    DataSeederController
  ]
})
export class DataSeederModule {}
