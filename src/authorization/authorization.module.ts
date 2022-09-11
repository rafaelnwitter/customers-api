import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AuthenticationGuard } from './authorization.guard';
import { AuthenticationService } from './authorization.service';

@Module({
  imports: [HttpModule],
  providers: [AuthenticationGuard, AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
