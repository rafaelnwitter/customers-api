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
import { CustomerService } from './customer.service';
import LogInDto from './dto/login-customer.dto';
import RegisterCustomerDto from './dto/register-customer.dto';
import jwt from 'jsonwebtoken';
import { Customer } from './entities/customer.interface';
import { v4 as uuid } from 'uuid'
// @UseGuards(AuthenticationGuard)
@UseInterceptors(CacheInterceptor)
@Controller('customers')
export class CustomerController {
  fakeValue = 'my name is rafael';
  fakeCustomer:Customer={
    id: uuid(),
    username: 'secret',
    document: 5129521,
    email: "teste@teste.com"
  }
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly service: CustomerService,
  ) {}

  @Get('auto-cache')
  @CacheKey('customer')
  async getSimpleRedisTest(){
    return this.fakeCustomer;
  }


  @Get('/:id')
  @CacheKey('customer')
  async getCustomer(@Param('id') uuid: string): Promise<string> {
    const cachedData = await this.cacheManager.get<Customer>('customer');
    if (cachedData) {
      console.log(`Getting data from cache!`);
      console.log(cachedData);
      return `${cachedData}`;
    }
    const teste = await this.service.getCustomer(uuid);
    await this.cacheManager.set(uuid, teste);
    return teste;
  }

  @Get()
  async logIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
   // console.log(request);
    // console.log(response);
    const payload = this.service.getLoginToken(request);
    this.defineCache(await payload);
    return payload;
  }

  @Get('testando')
  async defineCache(payload){
    const idToken = payload['id_token'];
    const authToken = payload['access_token'];
    const idTokenDecoded = jwt.decode(idToken);
    await this.cacheManager.set(`customer:${idTokenDecoded['sub']}`, idTokenDecoded);
    const valor = this.cacheManager.get<Customer>(`customer:${idTokenDecoded['sub']}`);
    if(valor){
      return {
        data: valor,
        LoadsFrom: 'redis cache'
      }
    }
    return {
      data: 'se fudeu',
      LoadsFrom: "nada",
    }
  }

  @Get('oi')
  oiteste(@Body() data: RegisterCustomerDto): any {
    return data;
  }

  @Get('da')
  async registerCustomer(
    // @Req() request: Request,
    // @Res({ passthrough: true }) response: Response,
    @Body() data: RegisterCustomerDto) {
      console.log(data);
  }
}
