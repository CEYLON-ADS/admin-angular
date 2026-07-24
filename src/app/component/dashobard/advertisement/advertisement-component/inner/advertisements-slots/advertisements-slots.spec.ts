import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementsSlots } from './advertisements-slots';

describe('AdvertisementsSlots', () => {
  let component: AdvertisementsSlots;
  let fixture: ComponentFixture<AdvertisementsSlots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertisementsSlots]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementsSlots);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
