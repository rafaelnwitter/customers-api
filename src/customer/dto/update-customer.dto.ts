import { PartialType } from '@nestjs/mapped-types';
import { RegisterCustomerDto } from './register-customer.dto';

export class UpdateCustomerDto extends PartialType(RegisterCustomerDto) {}
