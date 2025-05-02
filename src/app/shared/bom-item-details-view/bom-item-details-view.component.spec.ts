import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BomItemDetailsViewComponent } from './bom-item-details-view.component';

describe('BomItemDetailsViewComponent', () => {
  let component: BomItemDetailsViewComponent;
  let fixture: ComponentFixture<BomItemDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomItemDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomItemDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
