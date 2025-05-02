import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSelectionListComponent } from './location-selection-list.component';

describe('LocationSelectionListComponent', () => {
  let component: LocationSelectionListComponent;
  let fixture: ComponentFixture<LocationSelectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSelectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
