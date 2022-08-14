import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrderManagementComponent } from './user-order-management.component';

describe('UserOrderManagementComponent', () => {
  let component: UserOrderManagementComponent;
  let fixture: ComponentFixture<UserOrderManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOrderManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
