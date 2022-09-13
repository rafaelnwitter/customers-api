import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import RegisterCustomerDto from './dto/register-customer.dto';
import Customer from './entities/customer.entity';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomerService {
  access_token = null;
  id_token = null;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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
      url: 'accounts.seguros.vitta.com.br/auth/realms/careers/customers',
      headers: {
        'Content-Type': 'application/json',
        'X-XSS-Protection': '1',
        //   Authorization:
        //     'Bearer ' +
        //     'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyTGYtamFReXZmQTNCN3dpVHZ3VkxhMjV1cHhiXzUtQXhZSDhmY3kySHhVIn0.eyJleHAiOjE2NjI3NjY4MTAsImlhdCI6MTY2Mjc2NjUxMCwianRpIjoiMzNhYWM1MTUtMDQ3My00ZjdjLThkMWQtYzgwMmJjNDRkYWYxIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zZWd1cm9zLnZpdHRhLmNvbS5ici9hdXRoL3JlYWxtcy9jYXJlZXJzIiwic3ViIjoiNzk0ZmFkNjktMzkxNy00OThmLThhNjUtMWVjZGU5NjlmMGRiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY3VzdG9tZXJzIiwiYWNyIjoiMSIsInJlc291cmNlX2FjY2VzcyI6eyJjdXN0b21lcnMiOnsicm9sZXMiOlsidXNlciJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJjbGllbnRJZCI6ImN1c3RvbWVycyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjEwLjUwLjIuMTcxIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWN1c3RvbWVycyIsImNsaWVudEFkZHJlc3MiOiIxMC41MC4yLjE3MSJ9.VjBGAgh0Rc0CZ7Cs-iik4_4zgh8456Mv5UnkWJKGjmADMwXpKBXetKxRdZv1-EHYL7M8ZINnYQ1TbaFp2nXyeBxq8Br52mHZX5rUZ8TrLhDUWgjLRtqNBDXJzwIjM7IVSlPt4tJr395LqsUFgRbTQodl1Cgl7qRzM0b4lnkhCDImaIP2AwatNd8qfuF_Spz08tmNsqSmVYi9AGf5n_zYBwzjYVOldU3FDe-tOWmkywrgsOarJuPoNR0qqcNH2BHYw8YVTvaMsibMO-b7i7cDHFnXzUZepuHv3JckB-q1U8z8-BvOqF1WsLYC_ManvbN7nXQMUdHzE7wc1IQg5GiDEA',
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

    // if not, call API and set the cache:
    const { data } = await this.httpService.axiosRef.get(
      `${this.configService.get('API_DOMAIN')}/consumers/${id}`,
    );

    return await `${data}`;
  }

  // async oi(data) {
  //   RSASHA256(
  //     base64UrlEncode(header) + "." +
  //     base64UrlEncode(payload),
  // }

  async log() {
    const options = {
      method: 'GET',
      url: 'https://accounts.seguros.vitta.com.br/auth/realms/careers/protocol/openid-connect/auth?client_id=customers&response_type=code&response_mode=fragment',
      params: {
        grant_type: 'client_credentials',
        client_id: 'customers',
        client_secret: '453000f7-47a0-4489-bc47-891c742650e2',
        response_type: 'code',
        response_mode: 'fragment',
      },
      headers: {
        cookie:
          'KC_RESTART=eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJiMzJlNTUxOC0xMDFhLTQ3ZWMtODYwNi00MmQ1MWVlM2JmMjgifQ.eyJjaWQiOiJjdXN0b21lcnMiLCJwdHkiOiJvcGVuaWQtY29ubmVjdCIsInJ1cmkiOiIqIiwiYWN0IjoiQVVUSEVOVElDQVRFIiwibm90ZXMiOnsiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zZWd1cm9zLnZpdHRhLmNvbS5ici9hdXRoL3JlYWxtcy9jYXJlZXJzIiwicmVzcG9uc2VfdHlwZSI6ImNvZGUiLCJyZXNwb25zZV9tb2RlIjoiZnJhZ21lbnQifX0.fkF6_IddlDUOsoF35sRLBCPxxfzGY40Cyuw5hV6b7iA; AUTH_SESSION_ID=2ba56672-b6f8-43e7-978a-3e300cd7cf00.keycloak-0; AUTH_SESSION_ID_LEGACY=2ba56672-b6f8-43e7-978a-3e300cd7cf00.keycloak-0',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyTGYtamFReXZmQTNCN3dpVHZ3VkxhMjV1cHhiXzUtQXhZSDhmY3kySHhVIn0.eyJleHAiOjE2NjI5NDUyNzQsImlhdCI6MTY2Mjk0NDk3NCwianRpIjoiZTlmYmQyMTMtYmZmOC00MWRmLThiZWEtNGVlYjJmMDQ2MmI1IiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zZWd1cm9zLnZpdHRhLmNvbS5ici9hdXRoL3JlYWxtcy9jYXJlZXJzIiwic3ViIjoiNzk0ZmFkNjktMzkxNy00OThmLThhNjUtMWVjZGU5NjlmMGRiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY3VzdG9tZXJzIiwiYWNyIjoiMSIsInJlc291cmNlX2FjY2VzcyI6eyJjdXN0b21lcnMiOnsicm9sZXMiOlsidXNlciJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJjbGllbnRJZCI6ImN1c3RvbWVycyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjEwLjUwLjEuMTU2IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWN1c3RvbWVycyIsImNsaWVudEFkZHJlc3MiOiIxMC41MC4xLjE1NiJ9.Omjg8gTh9rJL_ZAVBLU_XumD9Mqnabej3e5ScKyoHsncRd2nilt6Bxjgo24piPjq2_DmH_Y8DnKvMUOOoUfvzH2wVmHJW9BfrexJTnu4FMcQvY08aMOsp70IxbbM7dORnUIyVeztpfEbJTGznwRmdMgOorTXag8UlhGU75ve3pUZv3lbgrc020nIrLpY3JCKdBWqqh1-7PbBIryXbh2V6u5cdr9LumZgBtghn9pPQAuFgvLw6QPduZlsoULH1n-f-BwuMZbIqooc-YGKannfZgr5BDzgD8_jKd9ZYSP9sKlQRdBV6jGMAa9kj7NK5n1kI8ADI95IunILelocrWwRAQ',
      },
      data: {
        grant_type: 'client_credentials',
        client_id: 'customers',
        client_secret: '453000f7-47a0-4489-bc47-891c742650e2',
        username: 'rafawitt@hotmail.com',
        password: 'cmFmYXdpdHRAaG90bWFpbC5jb20=',
        scope: 'openid',
        code_challange: 'oJI7Uh0gMpz3E3OMLdT1FJs16r3shXZYB2jgh2UHuxA',
        code_challenge_method: 'S256',
        redirect_uri:
          'https://accounts.seguros.vitta.com.br/auth/realms/careers/account/#/security/signingin&state=2ee29d82-b25f-4bb9-91cd-a16eedf0c698&response_mode=fragment&response_type=code&scope=openid&nonce=51477080-4cdb-462d-8e7d-fb56ca2d523c&code_challenge=Msue_5GlHv8Hy_nYpMrupqXYAZRzjY3g7uIcyBO0bo4&code_challenge_method=S256',
      },
    };

    this.httpService.axiosRef
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
}
