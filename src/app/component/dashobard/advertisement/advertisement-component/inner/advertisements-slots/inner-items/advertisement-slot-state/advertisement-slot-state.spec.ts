import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementSlotState } from './advertisement-slot-state';

describe('AdvertisementSlotState', () => {
  let component: AdvertisementSlotState;
  let fixture: ComponentFixture<AdvertisementSlotState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertisementSlotState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementSlotState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
