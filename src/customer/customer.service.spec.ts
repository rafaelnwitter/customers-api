import { CACHE_MANAGER } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CustomerService } from './customer.service';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

describe('CustomerService', () => {
  let customerService: CustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        CustomerService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    customerService = moduleRef.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(customerService).toBeDefined();
  });
});
