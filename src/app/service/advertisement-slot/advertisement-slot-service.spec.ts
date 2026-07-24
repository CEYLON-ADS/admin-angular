import { TestBed } from '@angular/core/testing';

import { AdvertisementSlotService } from './advertisement-slot-service';

describe('AdvertisementSlotService', () => {
  let service: AdvertisementSlotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvertisementSlotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
