import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommerceManagerComponent } from './ecommerce-manager.component';

describe('EcommerceManagerComponent', () => {
  let component: EcommerceManagerComponent;
  let fixture: ComponentFixture<EcommerceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcommerceManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcommerceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
