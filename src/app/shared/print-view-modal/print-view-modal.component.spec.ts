import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintViewModalComponent } from './print-view-modal.component';

describe('PrintViewModalComponent', () => {
  let component: PrintViewModalComponent;
  let fixture: ComponentFixture<PrintViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
