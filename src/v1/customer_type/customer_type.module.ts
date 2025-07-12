import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerType } from './customer_type.entity';
import { CustomerTypeService } from './customer_type.service';
import { CustomerTypeController } from './customer_type.controller';


@Module({
  imports: [TypeOrmModule.forFeature([CustomerType])],
  providers: [CustomerTypeService],
  controllers: [CustomerTypeController],
  exports: [CustomerTypeService],
})
export class CustomerTypeModule {}