import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrouptogglerComponent } from './grouptoggler.component';

describe('GrouptogglerComponent', () => {
  let component: GrouptogglerComponent;
  let fixture: ComponentFixture<GrouptogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrouptogglerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrouptogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
