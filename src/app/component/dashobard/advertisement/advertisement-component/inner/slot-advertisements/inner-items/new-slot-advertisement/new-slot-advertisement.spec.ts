import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSlotAdvertisement } from './new-slot-advertisement';

describe('NewSlotAdvertisement', () => {
  let component: NewSlotAdvertisement;
  let fixture: ComponentFixture<NewSlotAdvertisement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSlotAdvertisement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSlotAdvertisement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
