import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueTrend } from './revenue-trend';

describe('RevenueTrend', () => {
  let component: RevenueTrend;
  let fixture: ComponentFixture<RevenueTrend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueTrend]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueTrend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
