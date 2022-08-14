import { TestBed } from '@angular/core/testing';

import { UserOrderManagementItemService } from './user-order-management-item.service';

describe('UserOrderManagementItemService', () => {
  let service: UserOrderManagementItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserOrderManagementItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
