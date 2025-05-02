import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAddModalComponent } from './item-add-modal.component';

describe('ItemAddModalComponent', () => {
  let component: ItemAddModalComponent;
  let fixture: ComponentFixture<ItemAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
