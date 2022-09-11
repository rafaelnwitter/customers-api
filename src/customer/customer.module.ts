import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import Customer from './entities/customer.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisCacheModule } from '../cache/cache.module';
import { AuthenticationModule } from 'src/authorization/authorization.module';
import { CustomerMiddleware } from './customer.middleware';

@Module({
  imports: [HttpModule, RedisCacheModule, AuthenticationModule],
  controllers: [CustomerController],
  providers: [CustomerController, CustomerService, ConfigService],
  exports: [CustomerService],
})
export class CustomerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CustomerMiddleware)
      .forRoutes(
        { path: 'customers/:id', method: RequestMethod.GET },
        { path: 'customers/:id', method: RequestMethod.PUT },
        { path: 'customers/:id', method: RequestMethod.PATCH },
        { path: 'customers/:id', method: RequestMethod.DELETE },
      );
  }
}
