import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningAds } from './running-ads';

describe('RunningAds', () => {
  let component: RunningAds;
  let fixture: ComponentFixture<RunningAds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunningAds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunningAds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
