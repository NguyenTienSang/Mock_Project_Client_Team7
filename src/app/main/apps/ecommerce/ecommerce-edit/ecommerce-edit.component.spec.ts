import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommerceEditComponent } from './ecommerce-edit.component';

describe('EcommerceEditComponent', () => {
  let component: EcommerceEditComponent;
  let fixture: ComponentFixture<EcommerceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcommerceEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcommerceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
