import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceWhatsappModalComponent } from './invoice-whatsapp-modal.component';

describe('InvoiceWhatsappModalComponent', () => {
  let component: InvoiceWhatsappModalComponent;
  let fixture: ComponentFixture<InvoiceWhatsappModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceWhatsappModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceWhatsappModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
