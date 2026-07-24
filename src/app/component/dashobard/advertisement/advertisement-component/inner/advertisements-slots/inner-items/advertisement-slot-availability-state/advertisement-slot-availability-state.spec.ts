import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementSlotAvailabilityState } from './advertisement-slot-availability-state';

describe('AdvertisementSlotAvailabilityState', () => {
  let component: AdvertisementSlotAvailabilityState;
  let fixture: ComponentFixture<AdvertisementSlotAvailabilityState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertisementSlotAvailabilityState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementSlotAvailabilityState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
