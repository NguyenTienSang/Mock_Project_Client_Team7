import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommerceAddComponent } from './ecommerce-add.component';

describe('EcommerceAddComponent', () => {
  let component: EcommerceAddComponent;
  let fixture: ComponentFixture<EcommerceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcommerceAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcommerceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
