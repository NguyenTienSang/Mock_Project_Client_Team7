import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListDeletedComponent } from './user-deleted.component';

describe('UserListDeletedComponent', () => {
  let component: UserListDeletedComponent;
  let fixture: ComponentFixture<UserListDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListDeletedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
