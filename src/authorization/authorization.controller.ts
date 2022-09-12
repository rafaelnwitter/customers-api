import {
  Body,
  Controller,
  Post,
  Redirect,
  Req,
  Res,
  Response,
  Request,
} from '@nestjs/common';
import csurf from 'csurf';
import { request } from 'http';
import getAuthTokenDTO from 'src/customer/dto/login-customer.dto';
import { AuthenticationService } from './authorization.service';

@Controller('auth')
export class AuthorizationController {
  constructor(private authService: AuthenticationService) {}

  @Post()
  async logIn(
    @Body() userDto: getAuthTokenDTO,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.getLoginToken(userDto);
  }
}
