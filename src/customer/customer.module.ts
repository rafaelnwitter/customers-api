import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import Customer from './entities/customer.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  controllers: [CustomerController],
  providers: [CustomerService, ConfigService],
  exports: [CustomerService],
})
export class CustomerModule {}
