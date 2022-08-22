import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVoucherManagementComponent } from './user-voucher-management.component';

describe('UserVoucherManagementComponent', () => {
  let component: UserVoucherManagementComponent;
  let fixture: ComponentFixture<UserVoucherManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserVoucherManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserVoucherManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
