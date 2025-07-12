import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcvRange } from './acv_range.entity';
import { AcvRangeService } from './acv_range.service';
import { AcvRangeController } from './acv_range.controller';


@Module({
  imports: [TypeOrmModule.forFeature([AcvRange])],
  providers: [AcvRangeService],
  controllers: [AcvRangeController],
  exports: [AcvRangeService],
})
export class AcvRangeModule {}