import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVoucherUserManagementComponent } from './list-voucher-user-management.component';

describe('ListVoucherUserManagementComponent', () => {
  let component: ListVoucherUserManagementComponent;
  let fixture: ComponentFixture<ListVoucherUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListVoucherUserManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVoucherUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
