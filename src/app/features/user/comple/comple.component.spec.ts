import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleComponent } from './comple.component';

describe('CompleComponent', () => {
  let component: CompleComponent;
  let fixture: ComponentFixture<CompleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
