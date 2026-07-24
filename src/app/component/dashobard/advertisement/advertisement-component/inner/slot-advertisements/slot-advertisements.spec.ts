import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotAdvertisements } from './slot-advertisements';

describe('SlotAdvertisements', () => {
  let component: SlotAdvertisements;
  let fixture: ComponentFixture<SlotAdvertisements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotAdvertisements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotAdvertisements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
