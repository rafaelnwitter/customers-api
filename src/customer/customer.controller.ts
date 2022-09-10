import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Request,
  Response,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { Cache } from 'cache-manager';
import { CustomerService } from './customer.service';
import LogInDto from './dto/login-customer.dto';
import RegisterCustomerDto from './dto/register-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly service: CustomerService,
  ) {}
  
  @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  @CacheKey('customer')
  @Get('/:id')
  async getCustomer(@Param('id') uuid: string): Promise<string> {
    return await this.service.getCustomer(uuid);
  }

  @Get()
  async logIn(@Req() request: Request) {
    return this.service.getLoginToken();
  }

  @Post()
  async registerCustomer(@Body() data: RegisterCustomerDto) {
    return this.service.newCustomer(data);
  }
}
