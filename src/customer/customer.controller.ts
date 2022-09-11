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
  UseGuards,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { Cache } from 'cache-manager';
import { Roles } from 'nest-keycloak-connect';
import { AuthenticationGuard } from '../authorization/authorization.guard';
import { RedisCacheService } from '../cache/cache.service';
import { CustomerService } from './customer.service';
import LogInDto from './dto/login-customer.dto';
import RegisterCustomerDto from './dto/register-customer.dto';
import jwt from 'jsonwebtoken';

// @UseGuards(AuthenticationGuard)
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly service: CustomerService,
    private cacheService: RedisCacheService,
  ) {}

  @CacheKey('customer')
  @Get('/:id')
  async getCustomer(@Param('id') uuid: string): Promise<string> {
    return await this.service.getCustomer(uuid);
  }

  @Get()
  async logIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
   // console.log(request);
    // console.log(response);
    const payload = this.service.getLoginToken(request);
    const jwt_sign = jwt.
  }

  @Get('oi')
  oiteste(): string {
    return `${this.service.getHello()} from admin`;
  }

  @Get('da')
  async registerCustomer(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() data: RegisterCustomerDto) {
      console.log(request);
      return this.service.newCustomer(data);
  }
}
