import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerDetailsModalComponent } from './ledger-details-modal.component';

describe('LedgerDetailsModalComponent', () => {
  let component: LedgerDetailsModalComponent;
  let fixture: ComponentFixture<LedgerDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
