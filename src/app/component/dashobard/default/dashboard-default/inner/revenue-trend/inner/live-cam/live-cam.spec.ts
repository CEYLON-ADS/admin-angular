import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCam } from './live-cam';

describe('LiveCam', () => {
  let component: LiveCam;
  let fixture: ComponentFixture<LiveCam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveCam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveCam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
