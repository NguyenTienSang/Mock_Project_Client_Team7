import { TestBed } from '@angular/core/testing';

import { UserOrderDetailService } from './user-order-detail.service';

describe('UserOrderDetailService', () => {
  let service: UserOrderDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserOrderDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
