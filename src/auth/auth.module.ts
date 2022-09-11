// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { LocalStrategy } from './local.strategy';
// import { JwtStrategy } from './jwt.strategy';
// import { CustomerModule } from '../customer/customer.module';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
// import { env } from 'process';
// import { AuthController } from './auth.controller';

// @Module({
//   imports: [
//     CustomerModule,
//     PassportModule,
//     JwtModule.register({
//       secret: process.env.KID,
//       signOptions: {
//         expiresIn: '1h',
//       },
//     }),
//   ],
//   providers: [AuthService, LocalStrategy, JwtStrategy],
//   exports: [AuthService],
//   controllers: [AuthController],
// })
// export class AuthModule {}
