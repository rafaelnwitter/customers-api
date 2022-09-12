import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from 'src/cache/cache.module';

import { AuthenticationGuard } from './authorization.guard';
import { AuthenticationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';

@Module({
  imports: [HttpModule, ConfigModule, RedisCacheModule],
  providers: [AuthenticationGuard, AuthenticationService],
  exports: [AuthenticationService],
  controllers: [AuthorizationController],
})
export class AuthenticationModule {}
