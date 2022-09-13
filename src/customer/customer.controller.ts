import { Body, CacheKey, Controller, Get, Param } from '@nestjs/common';
import { CustomerService } from './customer.service';
import RegisterCustomerDto from './dto/register-customer.dto';
import jwt from 'jsonwebtoken';
import { Customer } from './entities/customer.interface';
import { v4 as uuid } from 'uuid';
import { CacheService } from '../cache/cache.service';
// @UseGuards(AuthenticationGuard)
// @UseInterceptors(CacheInterceptor)
@Controller('customers')
export class CustomerController {
  fakeValue = 'my name is rafael';
  fakeCustomer: Customer = {
    id: uuid(),
    username: 'secret',
    document: 5129521,
    email: 'teste@teste.com',
  };
  constructor(
    private cacheManager: CacheService,
    private readonly service: CustomerService,
  ) {}

  @Get('auto-cache')
  @CacheKey('customer')
  async getSimpleRedisTest() {
    this.cacheManager.createCache(uuid(), this.fakeCustomer);
    return this.fakeCustomer;
  }

  @Get('/:id')
  @CacheKey('customer')
  async getCustomer(@Param('id') uuid: string): Promise<string> {
    const cachedData = await this.cacheManager.getConsumerCache('customer');
    if (cachedData) {
      console.log(`Getting data from cache!`);
      console.log(cachedData);
      return `${cachedData}`;
    }
    const teste = await this.service.getCustomer(uuid);
    await this.cacheManager.createCache(uuid, teste);
    return teste;
  }

  // @Get()
  // async logIn(
  //   @Req() request: Request,
  //   @Res({ passthrough: true }) response: Response,
  //   @Body() getInfo: getAuthTokenDTO,
  // ) {
  //   console.log(getInfo);
  //   return this.service.getLoginToken(getInfo);
  // }

  @Get('testando')
  async defineCache(payload) {
    const idToken = payload['id_token'];
    const authToken = payload['access_token'];
    const idTokenDecoded = jwt.decode(idToken);
    await this.cacheManager.createCache(
      `customer:${idTokenDecoded['sub']}`,
      idTokenDecoded,
    );
    const valor = this.cacheManager.getConsumerCache(
      `customer:${idTokenDecoded['sub']}`,
    );
    if (valor) {
      return {
        data: valor,
        LoadsFrom: 'redis cache',
      };
    }
    return {
      data: 'se fudeu',
      LoadsFrom: 'nada',
    };
  }

  @Get('login')
  testee() {
    return this.service.log();
  }

  @Get('oi')
  oiteste(@Body() data: RegisterCustomerDto): any {
    return this.service.access_token;
  }

  @Get('da')
  async registerCustomer(
    // @Req() request: Request,
    // @Res({ passthrough: true }) response: Response,
    @Body() data: RegisterCustomerDto,
  ) {
    console.log(data);
  }
}
