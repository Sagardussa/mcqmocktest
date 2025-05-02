import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingVoucherSelectionComponent } from './pending-voucher-selection.component';

describe('PendingVoucherSelectionComponent', () => {
  let component: PendingVoucherSelectionComponent;
  let fixture: ComponentFixture<PendingVoucherSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingVoucherSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingVoucherSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
