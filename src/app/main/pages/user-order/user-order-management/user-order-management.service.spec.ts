import { TestBed } from '@angular/core/testing';

import { UserOrderManagementService } from './user-order-management.service';

describe('UserOrderManagementService', () => {
  let service: UserOrderManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserOrderManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
