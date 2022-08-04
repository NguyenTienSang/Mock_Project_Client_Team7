import { TestBed } from '@angular/core/testing';

import { AuthConfirmEmailService } from './auth-confirm-email.service';

describe('AuthConfirmEmailService', () => {
  let service: AuthConfirmEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthConfirmEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
