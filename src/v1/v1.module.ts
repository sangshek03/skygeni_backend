import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DataSeederModule } from './data_seeding/data_seeding.module';
import { AccountIndustryModule } from './account_industry/account_industry.module';
import { AcvRangeModule } from './acv_range/acv_range.module';
import { CustomerTypeModule } from './customer_type/customer_type.module';

@Module({
  imports: [
    AccountIndustryModule,
    DataSeederModule,
    AcvRangeModule,
    CustomerTypeModule,
    RouterModule.register([
      { path: 'api/v1', module: AccountIndustryModule },
      { path: 'api/v1', module: AcvRangeModule },
      { path: 'api/v1', module: CustomerTypeModule },
      { path: 'api/v1', module: DataSeederModule },
    ]),
  ],
  providers: [],
})
export class V1Module {}
