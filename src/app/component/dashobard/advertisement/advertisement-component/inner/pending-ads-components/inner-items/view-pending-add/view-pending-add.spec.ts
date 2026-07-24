import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPendingAdd } from './view-pending-add';

describe('ViewPendingAdd', () => {
  let component: ViewPendingAdd;
  let fixture: ComponentFixture<ViewPendingAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPendingAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPendingAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
