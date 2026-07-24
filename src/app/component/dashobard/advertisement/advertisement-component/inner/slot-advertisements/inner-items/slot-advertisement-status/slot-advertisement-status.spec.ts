import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotAdvertisementStatus } from './slot-advertisement-status';

describe('SlotAdvertisementStatus', () => {
  let component: SlotAdvertisementStatus;
  let fixture: ComponentFixture<SlotAdvertisementStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotAdvertisementStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotAdvertisementStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
