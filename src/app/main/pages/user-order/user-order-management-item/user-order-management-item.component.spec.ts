import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrderManagementItemComponent } from './user-order-management-item.component';

describe('UserOrderManagementItemComponent', () => {
  let component: UserOrderManagementItemComponent;
  let fixture: ComponentFixture<UserOrderManagementItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOrderManagementItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrderManagementItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
