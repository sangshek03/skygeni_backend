import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountIndustry } from './account_industry.entity';
import { AccountIndustryController } from './account_industry.controller';
import { AccountIndustryService } from './account_industry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountIndustry])
  ],
  providers: [
    AccountIndustryService
  ],
  controllers: [
    AccountIndustryController
  ],
  exports: [
    AccountIndustryService
  ],
})
export class AccountIndustryModule {}
