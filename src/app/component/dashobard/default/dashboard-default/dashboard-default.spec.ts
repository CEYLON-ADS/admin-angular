import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDefault } from './dashboard-default';

describe('DashboardDefault', () => {
  let component: DashboardDefault;
  let fixture: ComponentFixture<DashboardDefault>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDefault]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDefault);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
