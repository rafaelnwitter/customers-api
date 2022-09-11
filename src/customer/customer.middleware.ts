import { Injectable, NestMiddleware } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.interface';

export interface CustomRequest extends Request {
  customer: Customer;
}

@Injectable()
export class CustomerMiddleware implements NestMiddleware {
  constructor(private readonly customerService: CustomerService) {}
  use(req: any, res: any, next: () => void) {
    next();
  }
}
