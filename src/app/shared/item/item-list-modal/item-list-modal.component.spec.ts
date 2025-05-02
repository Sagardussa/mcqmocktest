import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListModalComponent } from './item-list-modal.component';

describe('ItemListModalComponent', () => {
  let component: ItemListModalComponent;
  let fixture: ComponentFixture<ItemListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
