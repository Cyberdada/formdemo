import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageboxComponent } from './imagebox.component';

describe('ImageboxComponent', () => {
  let component: ImageboxComponent;
  let fixture: ComponentFixture<ImageboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
