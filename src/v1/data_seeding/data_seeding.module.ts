import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountIndustry } from '../account_industry/account_industry.entity';
import { DataSeederService } from './data_seeding.service';
import { DataSeederController } from './data_seeding.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([AccountIndustry])
  ],
  providers: [
    DataSeederService
  ],
  controllers: [
    DataSeederController
  ]
})
export class DataSeederModule {}
