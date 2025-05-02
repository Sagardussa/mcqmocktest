import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePreviewModelComponent } from './image-preview-model.component';

describe('ImagePreviewModelComponent', () => {
  let component: ImagePreviewModelComponent;
  let fixture: ComponentFixture<ImagePreviewModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagePreviewModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePreviewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
