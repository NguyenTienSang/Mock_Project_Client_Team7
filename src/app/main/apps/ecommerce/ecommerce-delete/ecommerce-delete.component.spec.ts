import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommerceDeleteComponent } from './ecommerce-delete.component';

describe('EcommerceDeleteComponent', () => {
  let component: EcommerceDeleteComponent;
  let fixture: ComponentFixture<EcommerceDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcommerceDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcommerceDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
