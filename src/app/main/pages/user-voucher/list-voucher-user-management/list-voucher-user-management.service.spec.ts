import { TestBed } from '@angular/core/testing';

import { ListVoucherUserManagementService } from './list-voucher-user-management.service';

describe('ListVoucherUserManagementService', () => {
  let service: ListVoucherUserManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListVoucherUserManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
