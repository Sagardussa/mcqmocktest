import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerSelectionComponent } from './ledger-selection.component';

describe('LedgerSelectionComponent', () => {
  let component: LedgerSelectionComponent;
  let fixture: ComponentFixture<LedgerSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LedgerSelectionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
