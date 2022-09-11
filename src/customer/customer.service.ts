import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  AxiosRequestConfig,
  AxiosResponse,
} from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { Observable, interval } from 'rxjs';
import RegisterCustomerDto from './dto/register-customer.dto';
import Customer from './entities/customer.entity';
import { v4 } from 'uuid';
import LogInDto from './dto/login-customer.dto';
import { ConfigService } from '@nestjs/config';
import { ResponseToken } from './dto/response.interface';
import { RedisCacheService } from '../cache/cache.service';
import { createDecipheriv, Hash } from 'crypto';
import jwt_decode from 'jwt-decode';
import { AuthenticationService } from '../authorization/authorization.service';

@Injectable()
export class CustomerService {
  constructor(
    private cacheService: RedisCacheService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
  ) {}

  getHello() {
    return 'Method not implemented.';
  }

  async newCustomer(data: RegisterCustomerDto) {
    const customer = new Customer();
    customer.id = v4();
    customer.password = Buffer.from(data.email).toString('base64');

    const options = {
      method: 'POST',
      url: 'https://accounts.seguros.vitta.com.br/customers',
      headers: {
        'Content-Type': 'application/json',
        'X-XSS-Protection': '1',
        Authorization:
          'Bearer ' +
          'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyTGYtamFReXZmQTNCN3dpVHZ3VkxhMjV1cHhiXzUtQXhZSDhmY3kySHhVIn0.eyJleHAiOjE2NjI3NjY4MTAsImlhdCI6MTY2Mjc2NjUxMCwianRpIjoiMzNhYWM1MTUtMDQ3My00ZjdjLThkMWQtYzgwMmJjNDRkYWYxIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zZWd1cm9zLnZpdHRhLmNvbS5ici9hdXRoL3JlYWxtcy9jYXJlZXJzIiwic3ViIjoiNzk0ZmFkNjktMzkxNy00OThmLThhNjUtMWVjZGU5NjlmMGRiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY3VzdG9tZXJzIiwiYWNyIjoiMSIsInJlc291cmNlX2FjY2VzcyI6eyJjdXN0b21lcnMiOnsicm9sZXMiOlsidXNlciJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJjbGllbnRJZCI6ImN1c3RvbWVycyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjEwLjUwLjIuMTcxIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWN1c3RvbWVycyIsImNsaWVudEFkZHJlc3MiOiIxMC41MC4yLjE3MSJ9.VjBGAgh0Rc0CZ7Cs-iik4_4zgh8456Mv5UnkWJKGjmADMwXpKBXetKxRdZv1-EHYL7M8ZINnYQ1TbaFp2nXyeBxq8Br52mHZX5rUZ8TrLhDUWgjLRtqNBDXJzwIjM7IVSlPt4tJr395LqsUFgRbTQodl1Cgl7qRzM0b4lnkhCDImaIP2AwatNd8qfuF_Spz08tmNsqSmVYi9AGf5n_zYBwzjYVOldU3FDe-tOWmkywrgsOarJuPoNR0qqcNH2BHYw8YVTvaMsibMO-b7i7cDHFnXzUZepuHv3JckB-q1U8z8-BvOqF1WsLYC_ManvbN7nXQMUdHzE7wc1IQg5GiDEA',
      },
      data: {
        document: data.document,
        name: data.name,
      },
    };
    await this.httpService.axiosRef
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async getCustomer(id: string): Promise<string> {
    // check if data is in cache:
    const cachedData = this.cacheService.get(id);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return `${cachedData}`;
    }

    // if not, call API and set the cache:
    const { data } = await this.httpService.axiosRef.get(
      `${this.configService.get('API_DOMAIN')}/consumers/${id}`,
    );
    await this.cacheService.set(id, data);
    return await `${data.name}`;
  }

  // async oi(data) {
  //   RSASHA256(
  //     base64UrlEncode(header) + "." +
  //     base64UrlEncode(payload),
  // }

  async getLoginToken(data): Promise<AxiosResponse> {
    const options = {
      method: 'POST',
      url: `${this.configService.get(
        'API_DOMAIN',
      )}/auth/realms/careers/protocol/openid-connect/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-XSS-Protection': '1',
      },
      data: `grant_type=${this.configService.get(
        'GRANT_TYPE',
      )}&client_id=${this.configService.get(
        'CLIENT_ID',
      )}&client_secret=${this.configService.get(
        'CLIENT_SECRET',
      )}&username=${this.configService.get(
        'USERNAME',
      )}&password=${this.configService.get(
        'PASSWORD',
      )}&response_type=code&scope=${this.configService.get(
        'SCOPE',
      )}&code_challenge=oJI7Uh0gMpz3E3OMLdT1FJs16r3shXZYB2jgh2UHuxA&code_challenge_method=S256`,
    };
    let resp;
    await this.httpService.axiosRef
      .request(options)
      .then(function (response) {
        console.log(response);
        resp = response.data;
        // console.log(response, response.data, response.headers, response.status);
       // this.cacheManager.set('customer', resp);
      })
      .catch(function (error) {
        console.error(error);
      });
    const decoded: any = jwt_decode(resp['access_token']);
    this.cacheService.set('customer', decoded.sub);
    // console.log(decoded);
    // this.authService.authenticate(decoded);
    return resp;
  }
}
