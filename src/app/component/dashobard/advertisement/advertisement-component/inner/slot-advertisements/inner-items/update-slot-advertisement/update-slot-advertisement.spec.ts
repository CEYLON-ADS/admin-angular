import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSlotAdvertisement } from './update-slot-advertisement';

describe('UpdateSlotAdvertisement', () => {
  let component: UpdateSlotAdvertisement;
  let fixture: ComponentFixture<UpdateSlotAdvertisement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSlotAdvertisement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSlotAdvertisement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
