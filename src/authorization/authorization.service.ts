import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import getAuthTokenDTO from 'src/customer/dto/login-customer.dto';

import { Role, User } from './interface/user.model';

export class AuthenticationError extends Error {}

@Injectable()
export class AuthenticationService {
  private readonly baseURL: string;
  private readonly realm: string;
  private readonly routeToken: string;
  private authToken: string;
  private idToken: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseURL = process.env.API_DOMAIN;
    this.realm = process.env.REALM;
    this.routeToken = process.env.API_ROUTE;
  }

  /**
   * Call the OpenId Token ClientCredentials endpoint on Keycloak
   *
   * If it succeeds, the token is valid and we get the user infos in the response
   * If it fails, the token is invalid or expired
   */
  async getLoginToken(getCredentialsDto: getAuthTokenDTO) {
    const options = {
      method: 'POST',
      url: `${this.configService.get('API_DOMAIN')}${this.configService.get(
        'API_ROUTE',
      )}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-XSS-Protection': '1',
      },
      data: `grant_type=${getCredentialsDto.grant_type}',
      )}&client_id=${
        getCredentialsDto.client_id || this.configService.get('CLIENT_ID')
      }&client_secret=${
        getCredentialsDto.client_secret ||
        this.configService.get('CLIENT_SECRET')
      }&username=${
        getCredentialsDto.email || this.configService.get('USERNAME')
      }&password=${
        Buffer.from(getCredentialsDto.email).toString('base64') ||
        this.configService.get('PASSWORD')
      }&response_type=code&scope=${
        getCredentialsDto.scope || this.configService.get('SCOPE')
      }`,
    };
    let resp;
    await this.httpService.axiosRef
      .request(options)
      .then((result) => {
        if (result) {
          resp = result.data;
          this.authToken = resp['access_token'];
          this.idToken = resp['id_token'];
        }
      })
      .catch((err) => {
        console.error(err);
      });
    return this.authenticate(this.authToken);
  }

  /**
   * Call the OpenId Connect UserInfo endpoint on Keycloak: https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
   *
   * If it succeeds, the token is valid and we get the user infos in the response
   * If it fails, the token is invalid or expired
   */
  async authenticate(accessToken?: string): Promise<User> {
    const url = `${this.baseURL}/realms/${this.realm}/protocol/openid-connect/token`;

    try {
      const response = await this.httpService.axiosRef.get<User>(url, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        sub: response.data.sub,
        preferred_username: response.data.preferred_username,
        resource_access: [response.data.resource_access['customers']],
      };
    } catch (e) {
      throw new AuthenticationError(e.message);
    }
  }
}
