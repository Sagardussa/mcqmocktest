import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLedgerComponent } from './search-ledger.component';

describe('SearchLedgerComponent', () => {
  let component: SearchLedgerComponent;
  let fixture: ComponentFixture<SearchLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
