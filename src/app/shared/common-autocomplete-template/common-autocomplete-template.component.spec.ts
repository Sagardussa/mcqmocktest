import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAutocompleteTemplateComponent } from './common-autocomplete-template.component';

describe('CommonAutocompleteTemplateComponent', () => {
  let component: CommonAutocompleteTemplateComponent;
  let fixture: ComponentFixture<CommonAutocompleteTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonAutocompleteTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAutocompleteTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
