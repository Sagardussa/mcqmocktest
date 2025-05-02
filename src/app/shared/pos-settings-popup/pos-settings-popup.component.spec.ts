import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSettingsPopupComponent } from './pos-settings-popup.component';

describe('PosSettingsPopupComponent', () => {
  let component: PosSettingsPopupComponent;
  let fixture: ComponentFixture<PosSettingsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosSettingsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSettingsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
