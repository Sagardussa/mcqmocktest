import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceEmailModalComponent } from './invoice-email-modal.component';

describe('InvoiceEmailModalComponent', () => {
  let component: InvoiceEmailModalComponent;
  let fixture: ComponentFixture<InvoiceEmailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceEmailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
