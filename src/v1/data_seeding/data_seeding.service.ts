import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { AccountIndustry } from '../account_industry/account_industry.entity';

@Injectable()
export class DataSeederService {
  constructor(
    @InjectRepository(AccountIndustry)
    private readonly accountIndustryRepo: Repository<AccountIndustry>,
  ) {}

  /**
   * Generic seeder that handles all data types
   * @param dataType Type of data to seed
   * @param filePath Path to JSON file
   */
  async seedFromJson(
    dataType: string,
    filePath: string,
  ): Promise<{ message: string; count: number }> {
    try {
      // Get path relative to project root (not dist folder)
      const projectRoot = process.cwd();
      const absolutePath = path.join(projectRoot, 'src', filePath);

      // Verify file exists first
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`File not found at path: ${absolutePath}`);
      }

      const rawData = fs.readFileSync(absolutePath, 'utf8');
      const jsonData = JSON.parse(rawData);

      let result;
      const repo = this.getRepository(dataType);

      await repo.clear(); // Clear existing data

      switch (dataType) {
        case 'account-industry':
          result = await repo.save(
            jsonData.map((item) => ({
              count: item.count,
              acv: item.acv,
              closed_fiscal_quarter: item.closed_fiscal_quarter,
              acct_industry: item.Acct_Industry,
              query_key: item.query_key || 'industry',
            })),
          );
          break;

        // case 'acv-range':
        //   result = await repo.save(jsonData.map(item => ({
        //     count: item.count,
        //     acv: item.acv,
        //     closed_fiscal_quarter: item.closed_fiscal_quarter,
        //     range: item.ACV_Range
        //   })));
        //   break;

        // case 'customer-type':
        //   result = await repo.save(jsonData.map(item => ({
        //     count: item.count,
        //     acv: item.acv,
        //     closed_fiscal_quarter: item.closed_fiscal_quarter,
        //     type: item.Cust_Type
        //   })));
        //   break;

        // case 'team':
        //   result = await repo.save(jsonData.map(item => ({
        //     count: item.count,
        //     acv: item.acv,
        //     closed_fiscal_quarter: item.closed_fiscal_quarter,
        //     name: item.Team
        //   })));
        //   break;

        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }

      return {
        message: `${dataType} data seeded successfully`,
        count: result.length,
      };
    } catch (error) {
      throw new Error(`Failed to seed ${dataType} data: ${error.message}`);
    }
  }

  private getRepository(dataType: string) {
    switch (dataType) {
      case 'account-industry':
        return this.accountIndustryRepo;
      //   case 'acv-range': return this.acvRangeRepo;
      //   case 'customer-type': return this.customerTypeRepo;
      //   case 'team': return this.teamRepo;
      default:
        throw new Error(`No repository for ${dataType}`);
    }
  }

  async getRecordCount(dataType: string): Promise<number> {
    return this.getRepository(dataType).count();
  }
}
