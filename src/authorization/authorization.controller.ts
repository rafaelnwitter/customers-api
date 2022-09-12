import { Body, Controller, Post } from '@nestjs/common';
import getAuthTokenDTO from 'src/customer/dto/login-customer.dto';
import { AuthenticationService } from './authorization.service';

@Controller('auth')
export class AuthorizationController {
  constructor(private authService: AuthenticationService) {}

  @Post()
  async getUserToken(@Body() userDto: getAuthTokenDTO) {
    return this.authService.getLoginToken(userDto);
  }
}
