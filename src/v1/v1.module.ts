import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DataSeederModule } from './data_seeding/data_seeding.module';
import { AccountIndustryModule } from './account_industry/account_industry.module';

@Module({
  imports: [
    AccountIndustryModule,
    DataSeederModule,
    RouterModule.register([
      { path: 'api/v1', module: AccountIndustryModule },
      { path: 'api/v1', module: DataSeederModule },
    ]),
  ],
  providers: [],
})
export class V1Module {}
