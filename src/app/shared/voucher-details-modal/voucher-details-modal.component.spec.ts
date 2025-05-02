import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherDetailsModalComponent } from './voucher-details-modal.component';

describe('VoucherDetailsModalComponent', () => {
  let component: VoucherDetailsModalComponent;
  let fixture: ComponentFixture<VoucherDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
