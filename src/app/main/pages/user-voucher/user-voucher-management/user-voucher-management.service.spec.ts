import { TestBed } from '@angular/core/testing';

import { UserVoucherManagementService } from './user-voucher-management.service';

describe('UserVoucherManagementService', () => {
  let service: UserVoucherManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserVoucherManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
