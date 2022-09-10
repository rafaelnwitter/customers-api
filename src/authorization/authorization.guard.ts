// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { expressJwtSecret } from 'jwks-rsa';
// import { promisify } from 'util';
// import * as jwt from 'express-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class AuthorizationGuard implements CanActivate {
//   private API_ROUTE: string;
//   private API_DOMAIN: string;

//   constructor(private configService: ConfigService) {
//     this.API_ROUTE = this.configService.get('API_ROUTE');
//     this.API_DOMAIN = this.configService.get('API_DOMAIN');
//   }
//   // async canActivate(context: ExecutionContext): Promise<boolean> {
//   //   const req = context.getArgByIndex(0);
//   //   const res = context.getArgByIndex(1);
//   //   const checkJwt = promisify(
//   //     jwt({
//   //       secret: expressJwtSecret({
//   //         cache: true,
//   //         rateLimit: true,
//   //         jwksRequestsPerMinute: 10,
//   //         jwksUri: `${this.API_DOMAIN}.well-know`,
//   //       }),
//   //       audience: this.API_DOMAIN,
//   //       issuer: this.API_DOMAIN,
//   //       alghoritms: ['RS256'],
//   //     }),
//   //   );

//   //   try {
//   //     await checkJwt(req, res);
//   //     return true;
//   //   } catch (error) {
//   //     throw new UnauthorizedException(error);
//   //   }
//   // }
// }
